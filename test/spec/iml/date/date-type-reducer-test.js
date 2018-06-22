import { SET_DATE_TYPE, default as dateTypeReducer } from '../../../../source/iml/date/date-type-reducer.js';
import deepFreeze from '@iml/deep-freeze';

describe('date type reducer', () => {
  it('should be a function', () => {
    expect(dateTypeReducer).toEqual(expect.any(Function));
  });

  describe('matching type', () => {
    it('should return the payload', () => {
      expect(
        dateTypeReducer(deepFreeze({}), {
          type: SET_DATE_TYPE,
          payload: true
        })
      ).toEqual({ isUtc: true });
    });
  });

  describe('non-matching type', () => {
    it('should return the state', () => {
      expect(
        dateTypeReducer(deepFreeze({}), {
          type: 'NON_EXISTENT_TYPE',
          payload: { key: 'val' }
        })
      ).toEqual({});
    });
  });
});
