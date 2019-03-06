import {
  SHOW_STEP_MODAL_ACTION,
  default as stepModalReducer
} from "../../../../source/iml/command/step-modal-reducer.js";
import deepFreeze from "@iml/deep-freeze";

describe("step modal reducer", () => {
  let job;
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
  });

  it("should be a function", () => {
    expect(stepModalReducer).toEqual(expect.any(Function));
  });

  describe("matching type", () => {
    it("should return the payload", () => {
      expect(
        stepModalReducer(deepFreeze({}), {
          type: SHOW_STEP_MODAL_ACTION,
          payload: job
        })
      ).toEqual(job);
    });
  });

  describe("non-matching type", () => {
    it("should return the state", () => {
      expect(
        stepModalReducer(deepFreeze({}), {
          type: "NON_EXISTENT_TYPE",
          payload: { key: "val" }
        })
      ).toEqual({});
    });
  });
});
