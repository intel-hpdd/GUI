// @flow

import { render } from "inferno";
import highland from "highland";

describe("command modal", () => {
  let data, commands, CommandModalComponent, cb, div, body, component, jobStream, session$, modalStack$;
  let mockSocketStream, mockMoment, mockGetStore;

  beforeEach(() => {
    data = {
      objects: [
        {
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
        }
      ]
    };
    jobStream = highland();
    mockSocketStream = jest.fn(url => {
      if (url === "/job") return jobStream;
    });
    jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockSocketStream);

    mockMoment = jest.fn(() => ({
      format: jest.fn(() => "Jan 01 2019 00:00:00")
    }));
    jest.mock("moment", () => mockMoment);

    session$ = highland();
    modalStack$ = highland();
    mockGetStore = {
      select: jest.fn(name => {
        if (name === "session") return session$;
        else if (name === "modalStack") return modalStack$;
      }),
      dispatch: jest.fn()
    };
    jest.mock("../../../../source/iml/store/get-store.js", () => mockGetStore);

    CommandModalComponent = require("../../../../source/iml/command/command-modal.js").CommandModalComponent;

    session$.write({
      session: {
        user: "user"
      }
    });

    modalStack$.write(["COMMAND_MODAL_NAME"]);

    commands = [
      {
        cancelled: false,
        complete: true,
        created_at: "created_at",
        errored: false,
        id: 7,
        jobs: ["/api/job/1"],
        logs: "logs",
        message: "message",
        state: "state",
        resource_uri: "resource_uri"
      }
    ];
    cb = jest.fn();

    body = document.querySelector("body");
    div = document.createElement("div");

    if (body != null) body.appendChild(div);

    component = <CommandModalComponent commands={commands} closeCb={cb} />;
    render(component, div);
  });

  it("should render the component", () => {
    jobStream.write(data);
    expect(div).toMatchSnapshot();

    render(null, div);
    if (body) body.removeChild(div);
  });

  describe("on destroy", () => {
    beforeEach(() => {
      cb.mockImplementation(() => {
        render(null, div);
        if (body) body.removeChild(div);
      });
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    it("should dispatch with the MODAL_STACK_REMOVE_MODAL type", () => {
      expect(mockGetStore.dispatch).lastCalledWith({
        type: "MODAL_STACK_REMOVE_MODAL",
        payload: "COMMAND_MODAL_NAME"
      });
    });
  });
});
