// @flow

import {
  CONFIRM_ACTION,
  CLEAR_CONFIRM_ACTION,
  type ConfirmActionPayloadT,
  default as confirmActionReducer
} from "../../../../source/iml/action-dropdown/confirm-action-reducer.js";

describe("confirmActionReducer", () => {
  let sampleData: ConfirmActionPayloadT;

  beforeEach(() => {
    sampleData = {
      action: jest.fn(),
      message: "message",
      prompts: ["prompt1"],
      required: false,
      label: "label"
    };
  });

  describe("confirming the action", () => {
    it("should return the new state", () => {
      const result = confirmActionReducer({}, { type: CONFIRM_ACTION, payload: sampleData });
      expect(result).toEqual(sampleData);
    });
  });

  describe("clearing the confirm modal", () => {
    it("should return an empty state", () => {
      const result = confirmActionReducer(sampleData, { type: CLEAR_CONFIRM_ACTION, payload: {} });
      expect(result).toEqual({});
    });
  });
});
