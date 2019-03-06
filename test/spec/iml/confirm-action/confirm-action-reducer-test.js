import {
  CONFIRM_ACTION,
  CLEAR_CONFIRM_ACTION,
  default as confirmActionReducer
} from "../../../../source/iml/action-dropdown/confirm-action-reducer.js";
import deepFreeze from "@iml/deep-freeze";

describe("confirm action reducer", () => {
  let confirmAction;
  beforeEach(() => {
    confirmAction = {
      action: () => {},
      message: "message",
      prompts: [],
      required: false,
      label: "label"
    };
  });

  it("should be a function", () => {
    expect(confirmActionReducer).toEqual(expect.any(Function));
  });

  describe("on confirm action", () => {
    it("should return the payload", () => {
      expect(
        confirmActionReducer(deepFreeze({}), {
          type: CONFIRM_ACTION,
          payload: confirmAction
        })
      ).toEqual(confirmAction);
    });
  });

  describe("on clear confirm action", () => {
    it("should clear the action", () => {
      expect(
        confirmActionReducer(deepFreeze({}), {
          type: CLEAR_CONFIRM_ACTION,
          payload: {}
        })
      ).toEqual({});
    });
  });

  describe("non-matching type", () => {
    it("should return the state", () => {
      expect(
        confirmActionReducer(deepFreeze({}), {
          type: "NON_EXISTENT_TYPE",
          payload: { key: "val" }
        })
      ).toEqual({});
    });
  });
});
