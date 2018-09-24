import { setTimeZoneToUtc, setTimeZoneToLocal } from "../../../../source/iml/tz-picker/tz-picker-actions.js";
import { SET_TIME_ZONE } from "../../../../source/iml/tz-picker/tz-picker-reducer.js";

describe("date type actions", () => {
  it("should provide an action when setting to UTC", () => {
    expect(setTimeZoneToUtc()).toEqual({
      type: SET_TIME_ZONE,
      payload: true
    });
  });

  it("should provide an action when setting to Local", () => {
    expect(setTimeZoneToLocal()).toEqual({
      type: SET_TIME_ZONE,
      payload: false
    });
  });
});
