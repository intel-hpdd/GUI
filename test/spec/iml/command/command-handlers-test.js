// @flow

import highland from "highland";
import { render } from "inferno";

describe("command module", () => {
  let commandModal$, stepModal$, session$, modalStack$, socket$, getCommand$, container;
  let mockGetStore, mockGetCommandStream, mockSocketStream;

  beforeEach(() => {
    commandModal$ = highland();
    stepModal$ = highland();
    session$ = highland();
    modalStack$ = highland();

    mockGetStore = {
      select: jest.fn(name => {
        if (name === "commandModal") return commandModal$;
        else if (name === "stepModal") return stepModal$;
        else if (name === "session") return session$;
        else if (name === "modalStack") return modalStack$;
      }),
      dispatch: jest.fn()
    };
    jest.mock("../../../../source/iml/store/get-store.js", () => mockGetStore);

    getCommand$ = highland();
    mockGetCommandStream = jest.fn(() => getCommand$);
    jest.mock("../../../../source/iml/command/get-command-stream.js", () => mockGetCommandStream);

    socket$ = highland();
    mockSocketStream = jest.fn(() => socket$);
    jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockSocketStream);

    require("../../../../source/iml/command/command-handlers.js");
  });

  describe("command modal", () => {
    let commands;

    beforeEach(() => {
      commands = [
        {
          cancelled: false,
          complete: true,
          created_at: "2019-01-01T00:00:00",
          errored: false,
          id: 7,
          jobs: ["/api/job/1"],
          logs: "logs",
          message: "message",
          state: "state",
          resource_uri: "resource_uri"
        }
      ];

      mockGetCommandStream.mockImplementation(() => getCommand$);
    });

    describe("with commands", () => {
      beforeEach(() => {
        commandModal$.write(commands);
        getCommand$.write(commands);

        if (document.body) container = document.body.querySelector("div");
      });

      afterEach(() => {
        render(null, container);
        if (document.body)
          while (document.body.children.length > 0) document.body.removeChild(document.body.children[0]);
      });

      it("should render the command modal", () => {
        expect(container).toMatchSnapshot();
      });

      describe("clicking the close button", () => {
        beforeEach(() => {
          let btn;
          if (container) btn = container.querySelector("button.btn-danger");
          if (btn) btn.click();
        });

        it("should close the modal", () => {
          let container;
          if (document.body) container = document.body.querySelector("div");

          expect(container).toBeNull();
        });

        it("should clear confirm action", () => {
          expect(mockGetStore.dispatch).toHaveBeenCalledWith({
            type: "CLEAR_CONFIRM_ACTION",
            payload: false
          });
        });
      });
    });

    describe("without commanmds", () => {
      it("should not render", () => {
        let container;
        commandModal$.write([]);

        if (document.body) container = document.body.querySelector("div");
        expect(container).toBeNull();
      });
    });
  });

  describe("step modal", () => {
    let job, steps;
    beforeEach(() => {
      job = {
        children: [],
        available_transitions: [
          {
            label: "Cancel",
            state: "cancelled"
          }
        ],
        cancelled: false,
        class_name: "StartTargetJob",
        commands: ["/api/command/230/"],
        created_at: "2019-03-05T17:23:14.773266",
        description: "Start target MGS",
        errored: false,
        id: 523,
        modified_at: "2019-03-05T17:23:14.773240",
        read_locks: [],
        resource_uri: "/api/job/523/",
        state: "tasked",
        step_results: {
          "/api/step/951/": null
        },
        steps: ["/api/step/951/", "/api/step/952/"],
        wait_for: [],
        write_locks: []
      };

      steps = [
        {
          state: "success",
          args: [],
          step_index: 1,
          step_count: 1,
          class_name: "RunAction",
          description: "RunAction bla",
          console: "console",
          backtrace: "backtrace"
        }
      ];

      mockSocketStream.mockImplementation(name => {
        if (name === "/job/523") return highland([job]);
        else if (name === "/step") return highland([{ objects: steps }]);
      });
    });

    describe("with data", () => {
      beforeEach(() => {
        stepModal$.write(job);

        if (document.body) container = document.body.querySelector("div");
      });

      afterEach(() => {
        render(null, container);
        if (document.body)
          while (document.body.children.length > 0) document.body.removeChild(document.body.children[0]);
      });

      it("should render the step modal", () => {
        expect(container).toMatchSnapshot();
      });

      describe("clicking the close button", () => {
        beforeEach(() => {
          let btn;
          if (document.body) btn = document.body.querySelector("button.btn-danger");
          if (btn) btn.click();
        });

        it("should close the modal", () => {
          let container;
          if (document.body) container = document.body.querySelector("div");

          expect(container).toBeNull();
        });
      });
    });

    describe("without a job id", () => {
      beforeEach(() => {
        delete job.id;
        stepModal$.write(job);
        if (document.body) container = document.body.querySelector("div");
      });

      it("should not render the modal", () => {
        expect(container).toBeNull();
      });
    });
  });
});
