// @flow

describe("listeners", () => {
  let listeners, cb, availableAction, record;
  let mockActionDropdownModule, mockHandleAction, mockGlobal;

  beforeEach(() => {
    availableAction = {};
    record = {
      label: "label",
      resource_uri: "uri",
      state: "state",
      server_profile: { initial_state: "state" },
      install_method: "existing_keys_choice",
      content_type_id: 89,
      id: 1
    };

    mockHandleAction = {
      handleAction: jest.fn(),
      handleCheckDeploy: jest.fn(),
      handleCheckDeployPredicate: jest.fn()
    };
    jest.mock("../../../source/iml/action-dropdown/handle-action.js", () => mockHandleAction);

    mockGlobal = {
      addEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    };
    jest.mock("../../../source/iml/global.js", () => mockGlobal);

    mockActionDropdownModule = {
      ACTION_DROPDOWN_FLAG_CHECK_DEPLOY: "check_deploy"
    };
    jest.mock("../../../source/iml/action-dropdown/action-dropdown-module.js", () => mockActionDropdownModule);

    listeners = require("../../../source/iml/listeners.js");
  });

  it("should listen for a selected action", () => {
    expect(mockGlobal.addEventListener).toHaveBeenCalledWith("action_selected", expect.any(Function));
  });

  it("should listen for an hsm selected action", () => {
    expect(mockGlobal.addEventListener).toHaveBeenCalledWith("hsm_action_selected", expect.any(Function));
  });

  describe("when an action is selected and checkDeploy is called", () => {
    beforeEach(() => {
      mockHandleAction.handleCheckDeployPredicate.mockReturnValueOnce(true);

      cb = mockGlobal.addEventListener.mock.calls[0][1];

      cb({
        detail: {
          available_action: availableAction,
          record: record,
          flag: "check_deploy"
        }
      });
    });

    it("should call the check deploy predicate", () => {
      expect(mockHandleAction.handleCheckDeployPredicate).toHaveBeenCalledTimes(1);
      expect(mockHandleAction.handleCheckDeployPredicate).toHaveBeenCalledWith(availableAction, "state", {
        initial_state: "state"
      });
    });

    it("should call handleCheckDeploy", () => {
      expect(mockHandleAction.handleCheckDeploy).toHaveBeenCalledTimes(1);
      expect(mockHandleAction.handleCheckDeploy).toHaveBeenCalledWith({
        content_type_id: 89,
        id: 1,
        state: "state",
        install_method: "existing_keys_choice",
        label: "label",
        resourceUri: "uri",
        server_profile: { initial_state: "state" }
      });
    });
  });

  describe("when an action is selected and the flag doesn't match", () => {
    beforeEach(() => {
      mockHandleAction.handleCheckDeployPredicate.mockReturnValueOnce(true);

      cb = mockGlobal.addEventListener.mock.calls[0][1];

      cb({
        detail: {
          available_action: availableAction,
          record: record,
          flag: "non-matching-flag"
        }
      });
    });

    it("should call handleAction", () => {
      expect(mockHandleAction.handleAction).toHaveBeenCalledTimes(1);
      expect(mockHandleAction.handleAction).toHaveBeenCalledWith(availableAction, record.label, record.resource_uri);
    });

    it("should not call handleCheckDeployment", () => {
      expect(mockHandleAction.handleCheckDeployPredicate).not.toHaveBeenCalled();
    });

    it("should not call handleCheckDeploy", () => {
      expect(mockHandleAction.handleCheckDeploy).not.toHaveBeenCalled();
    });
  });

  describe("when an hsm action is selected", () => {
    let hsmControlParams, mdt;
    beforeEach(() => {
      mockHandleAction.handleCheckDeployPredicate.mockReturnValueOnce(true);
      mdt = {};
      hsmControlParams = {
        long_description: "description",
        param_key: "key",
        param_value: "value",
        verb: "verb",
        mdt
      };

      cb = mockGlobal.addEventListener.mock.calls[1][1];

      cb({
        detail: {
          record: record,
          hsm_control_param: hsmControlParams
        }
      });
    });

    it("should call handleAction", () => {
      expect(mockHandleAction.handleAction).toHaveBeenCalledTimes(1);
      expect(mockHandleAction.handleAction).toHaveBeenCalledWith(hsmControlParams, record.label);
    });
  });

  describe("handleSelectedAction", () => {
    let action;
    beforeEach(() => {
      action = {
        available_action: {
          args: { host_id: 1 },
          class_name: "class_name",
          composite_id: "89:1",
          confirmation: "confirmation",
          display_group: 1,
          display_order: 1,
          long_description: "long_description",
          state: "state",
          verb: "verb"
        },
        record,
        flag: null
      };
      listeners.handleSelectedAction(action);
    });

    it("should dispatch the event", () => {
      expect(mockGlobal.dispatchEvent).toHaveBeenCalledTimes(1);
      expect(mockGlobal.dispatchEvent).toHaveBeenCalledWith(
        new CustomEvent("action_selected", {
          detail: action
        })
      );
    });
  });

  describe("openAddServerModal", () => {
    let step;
    beforeEach(() => {
      step = "step";
      listeners.openAddServerModal(record, "step");
    });

    it("should dispatch the event", () => {
      expect(mockGlobal.dispatchEvent).toHaveBeenCalledTimes(1);
      expect(mockGlobal.dispatchEvent).toHaveBeenCalledWith(
        new CustomEvent("open_add_server_modal", {
          detail: { record, step }
        })
      );
    });
  });
});
