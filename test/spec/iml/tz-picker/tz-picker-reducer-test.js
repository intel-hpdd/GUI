import { SET_TIME_ZONE, default as tzPickerReducer } from "../../../../source/iml/tz-picker/tz-picker-reducer.js";
import deepFreeze from "@iml/deep-freeze";

describe("date type reducer", () => {
  it("should be a function", () => {
    expect(tzPickerReducer).toEqual(expect.any(Function));
  });

  describe("matching type", () => {
    it("should return the payload", () => {
      expect(
        tzPickerReducer(deepFreeze({}), {
          type: SET_TIME_ZONE,
          payload: true
        })
      ).toEqual({ isUtc: true });
    });
  });

  describe("non-matching type", () => {
    it("should return the state", () => {
      expect(
        tzPickerReducer(deepFreeze({}), {
          type: "NON_EXISTENT_TYPE",
          payload: { key: "val" }
        })
      ).toEqual({});
    });
  });
});
