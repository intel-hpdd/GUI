import highland from "highland";

describe("handle action", () => {
  let mockGetStore, mockSocketStream, mockListeners;
  let actionStream, handleAction, handleCheckDeployPredicate, handleCheckDeploy;

  beforeEach(() => {
    jest.useFakeTimers();
    mockSocketStream = jest.fn(() => {
      return (actionStream = highland());
    });
    jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockSocketStream);

    mockGetStore = {
      dispatch: jest.fn()
    };
    jest.mock("../../../../source/iml/store/get-store.js", () => mockGetStore);

    mockListeners = {
      openAddServerModal: jest.fn()
    };
    jest.mock("../../../../source/iml/listeners", () => mockListeners);

    const mod = require("../../../../source/iml/action-dropdown/handle-action.js");

    handleAction = mod.handleAction;
    handleCheckDeployPredicate = mod.handleCheckDeployPredicate;
    handleCheckDeploy = mod.handleCheckDeploy;
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });
  describe("executing a job", () => {
    let record, action, resourceUri;
    beforeEach(() => {
      record = { label: "foo bar" };
      action = {
        verb: "foo",
        class_name: "bar",
        args: { some: "stuff" },
        confirmation: "Are you sure you want to foo bar?"
      };
      resourceUri = "uri";
    });

    it("should launch the confirm modal", () => {
      handleAction(action, record.label, resourceUri);
      expect(mockGetStore.dispatch).toHaveBeenCalledTimes(1);
      expect(mockGetStore.dispatch).toHaveBeenCalledWith({
        type: "CONFIRM_ACTION",
        payload: {
          action: expect.any(Function),
          message: "foo(foo bar)",
          prompts: ["Are you sure you want to foo bar?"],
          required: true,
          label: "foo bar"
        }
      });
    });
  });

  describe("conf param", () => {
    let action;
    beforeEach(() => {
      action = {
        param_key: "some",
        param_value: "value",
        mdt: { resource: "target", id: "1", conf_params: {} }
      };
      handleAction(action);
    });

    it("should put the new param for conf param", () => {
      expect(mockSocketStream).toHaveBeenCalledOnceWith(
        "/target/1",
        {
          method: "put",
          json: { resource: "target", id: "1", conf_params: { some: "value" } }
        },
        true
      );
    });

    it("should show the command modal when data returns", () => {
      actionStream.write({ command: "command" });

      expect(mockGetStore.dispatch).toHaveBeenCalledTimes(1);
      expect(mockGetStore.dispatch).toHaveBeenCalledWith({
        type: "SHOW_COMMAND_MODAL_ACTION",
        payload: ["command"]
      });
    });
  });

  describe("state change", () => {
    let record, action, stream;
    beforeEach(() => {
      record = { resource_uri: "/api/target/2" };
      action = { state: "stopped" };
      stream = handleAction(action, "label", record.resource_uri);
    });

    it("should perform a dry run", () => {
      expect(mockSocketStream).toHaveBeenCalledOnceWith(
        record.resource_uri,
        { method: "put", json: { dry_run: true, state: "stopped" } },
        true
      );
    });

    describe("dry run with dependency jobs", () => {
      let response;
      beforeEach(() => {
        response = {
          transition_job: { description: "It's gonna do stuff!" },
          dependency_jobs: [{ requires_confirmation: true, description: "This will do stuff" }]
        };
        actionStream.write(response);
      });

      it("should launch the confirm action modal", () => {
        stream.each(() => {
          expect(mockGetStore.dispatch).toHaveBeenCalledOnceWith({
            type: "CONFIRM_ACTION",
            payload: {
              label: "label"
            }
          });
        });

        actionStream.write({});
        jest.runAllTimers();
      });
      it("should send the new state after confirm", () => {
        stream.each(() => {
          expect(
            expect(mockSocketStream).toHaveBeenCalledOnceWith(
              "/api/target/2",
              { method: "put", json: { state: "stopped" } },
              true
            )
          );
        });

        actionStream.write({});
        jest.runAllTimers();
      });
    });

    describe("dry run with transition job confirmation prompt", () => {
      let response;
      beforeEach(() => {
        response = {
          transition_job: { description: "It's gonna do stuff!", confirmation_prompt: true },
          dependency_jobs: []
        };
        actionStream.write(response);
      });

      it("should launch the confirm action modal", () => {
        stream.each(() => {
          expect(mockGetStore.dispatch).toHaveBeenCalledOnceWith({
            type: "CONFIRM_ACTION",
            payload: {
              label: "label"
            }
          });
        });

        actionStream.write({});
        jest.runAllTimers();
      });
      it("should send the new state after confirm", () => {
        stream.each(() => {
          expect(
            expect(mockSocketStream).toHaveBeenCalledOnceWith(
              "/api/target/2",
              { method: "put", json: { state: "stopped" } },
              true
            )
          );
        });

        actionStream.write({});
        jest.runAllTimers();
      });
    });

    describe("dry run with no dependency jobs or transition confirmation prompts", () => {
      let response;
      beforeEach(() => {
        response = {
          transition_job: { description: "It's gonna do stuff!" },
          dependency_jobs: []
        };
        actionStream.write(response);
      });

      it("should launch the confirm action modal", () => {
        stream.each(() => {
          expect(mockGetStore.dispatch).toHaveBeenCalledOnceWith({
            type: "CONFIRM_ACTION",
            payload: {
              label: "label"
            }
          });
        });

        actionStream.write({});
        jest.runAllTimers();
      });
      it("should send the new state after confirm", () => {
        stream.each(() => {
          expect(
            expect(mockSocketStream).toHaveBeenCalledOnceWith(
              "/api/target/2",
              { method: "put", json: { state: "stopped" } },
              true
            )
          );
        });

        actionStream.write({});
        jest.runAllTimers();
      });
    });
  });

  describe("handle check deploy predicate", () => {
    let action, state, profile;
    it("should fail the predicate", () => {
      action = {
        state: "ready",
        verb: "Reboot Host"
      };
      profile = {
        initial_state: "ready"
      };
      state = "ready";

      expect(handleCheckDeployPredicate(action, state, profile)).toEqual(false);
    });

    it("should pass the predicate", () => {
      action = {
        state: "ready",
        verb: "Reboot Host"
      };
      profile = {
        initial_state: "ready"
      };
      state = "undeployed";

      expect(handleCheckDeployPredicate(action, state, profile)).toEqual(true);
    });
  });

  describe("launching the add server modal", () => {
    describe("with the add step", () => {
      let record;
      it("should send a notification to open the add server modal", () => {
        record = {
          state: "undeployed",
          install_method: "other"
        };
        handleCheckDeploy(record);

        expect(mockListeners.openAddServerModal).toHaveBeenCalledTimes(1);
        expect(mockListeners.openAddServerModal).toHaveBeenCalledWith(record, "addServersStep");
      });
    });

    describe("with the status step", () => {
      let record;
      it("should send a notification to open the add server modal", () => {
        record = {
          state: "undeployed",
          install_method: "existing_keys_choice"
        };
        handleCheckDeploy(record);

        expect(mockListeners.openAddServerModal).toHaveBeenCalledTimes(1);
        expect(mockListeners.openAddServerModal).toHaveBeenCalledWith(record, "serverStatusStep");
      });
    });

    describe("with the select profile step", () => {
      let record;
      it("should send a notification to open the add server modal", () => {
        record = {
          state: "ready",
          install_method: "existing_keys_choice"
        };
        handleCheckDeploy(record);

        expect(mockListeners.openAddServerModal).toHaveBeenCalledTimes(1);
        expect(mockListeners.openAddServerModal).toHaveBeenCalledWith(record, "selectServerProfileStep");
      });
    });
  });
});
