// @flow

import { SET_DATE_TYPE } from './date-type-reducer.js';

export const setDateTypeToUtc = () => ({
  type: SET_DATE_TYPE,
  payload: true
});

export const setDateTypeToLocal = () => ({
  type: SET_DATE_TYPE,
  payload: false
});
