// @flow

import { SET_TIME_ZONE } from "./tz-picker-reducer";

export const setTimeZoneToUtc = () => ({
  type: SET_TIME_ZONE,
  payload: true
});

export const setTimeZoneToLocal = () => ({
  type: SET_TIME_ZONE,
  payload: false
});
