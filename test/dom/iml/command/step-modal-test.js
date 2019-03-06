// @flow

import { render } from "inferno";
import highland from "highland";

import type { JobT, StepT } from "../../../../source/iml/command/command-types.js";

describe("step modal", () => {
  let mockMoment, mockGetStore, StepModal, job: JobT, steps: StepT[], closeCb, div, body, modalStack$;
  beforeEach(() => {
    mockMoment = jest.fn(() => ({ format: jest.fn(() => "date-time") }));
    jest.mock("moment", () => mockMoment);

    modalStack$ = highland();
    mockGetStore = {
      dispatch: jest.fn(),
      select: jest.fn(() => modalStack$)
    };

    jest.mock("../../../../source/iml/store/get-store.js", () => mockGetStore);

    StepModal = require("../../../../source/iml/command/step-modal.js").StepModalComponent;

    div = document.createElement("div");
    body = document.querySelector("body");
    if (body) body.appendChild(div);

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

    closeCb = jest.fn();

    render(<StepModal job={job} steps={steps} closeCb={closeCb} />, div);
  });

  afterEach(() => {
    render(null, div);
    if (body && body.contains(div)) body.removeChild(div);
  });

  describe("rendering", () => {
    it("should render for a complete state", () => {
      expect(div).toMatchSnapshot();
    });

    it("should render for a pending state", () => {
      job = {
        ...job,
        state: "pending"
      };

      render(<StepModal job={job} steps={steps} closeCb={closeCb} />, div);
      expect(div).toMatchSnapshot();
    });

    describe("a complete job", () => {
      it("should render when cancelled", () => {
        job = {
          ...job,
          state: "complete",
          cancelled: true
        };

        render(<StepModal job={job} steps={steps} closeCb={closeCb} />, div);
        expect(div).toMatchSnapshot();
      });

      it("should render when errored", () => {
        job = {
          ...job,
          state: "complete",
          errored: true
        };

        render(<StepModal job={job} steps={steps} closeCb={closeCb} />, div);
        expect(div).toMatchSnapshot();
      });

      it("should render when succeeded", () => {
        job = {
          ...job,
          state: "complete"
        };

        render(<StepModal job={job} steps={steps} closeCb={closeCb} />, div);
        expect(div).toMatchSnapshot();
      });
    });

    describe("a loading job", () => {
      it("should render the loading component", () => {
        steps = [];

        render(<StepModal job={job} steps={steps} closeCb={closeCb} />, div);
        expect(div).toMatchSnapshot();
      });
    });

    describe("without a console", () => {
      it("should render without the console", () => {
        const [step] = [...steps];
        delete step.console;
        steps = [step];

        render(<StepModal job={job} steps={steps} closeCb={closeCb} />, div);
        expect(div).toMatchSnapshot();
      });
    });

    describe("without a backtrace", () => {
      it("should render without the backtrace", () => {
        const [step] = [...steps];
        delete step.backtrace;
        steps = [step];

        render(<StepModal job={job} steps={steps} closeCb={closeCb} />, div);
        expect(div).toMatchSnapshot();
      });
    });
  });

  describe("closing the modal", () => {
    let btn;
    beforeEach(() => {
      closeCb.mockImplementation(() => {
        render(null, div);
        if (body) body.removeChild(div);
      });

      btn = document.querySelector("button.btn-danger");
    });

    describe("by button", () => {
      beforeEach(() => {
        if (btn) btn.click();
      });

      it("should invoke the callback", () => {
        expect(closeCb).toHaveBeenCalledTimes(1);
      });
    });

    describe("by hitting escape", () => {
      beforeEach(() => {
        modalStack$.write(["STEP_MODAL_NAME"]);
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      });

      it("should invoke the callback", () => {
        expect(closeCb).toHaveBeenCalledTimes(1);
      });
    });
  });
});
