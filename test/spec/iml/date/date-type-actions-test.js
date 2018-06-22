import { setDateTypeToUtc, setDateTypeToLocal } from '../../../../source/iml/date/date-type-actions.js';
import { SET_DATE_TYPE } from '../../../../source/iml/date/date-type-reducer.js';

describe('date type actions', () => {
  it('should provide an action when setting to UTC', () => {
    expect(setDateTypeToUtc()).toEqual({
      type: SET_DATE_TYPE,
      payload: true
    });
  });

  it('should provide an action when setting to Local', () => {
    expect(setDateTypeToLocal()).toEqual({
      type: SET_DATE_TYPE,
      payload: false
    });
  });
});
