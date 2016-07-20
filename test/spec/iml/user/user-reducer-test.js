import {
  ADD_USER_ITEMS,
  default as userReducer
} from '../../../../source/iml/user/user-reducer.js';
import deepFreeze from 'intel-deep-freeze';

describe('user reducer', () => {
  it('should be a function', () => {
    expect(userReducer)
      .toEqual(jasmine.any(Function));
  });

  describe('matching type', () => {
    it('should return the payload', () => {
      expect(userReducer(deepFreeze([]), {
        type: ADD_USER_ITEMS,
        payload: [{}]
      })).toEqual([{}]);
    });
  });

  describe('non-matching type', () => {
    it('should return the state', () => {
      expect(
        userReducer(
        deepFreeze([]), {
          type: 'ADD_ALERT_INDICATOR_ITEMS',
          payload: {key: 'val'}
        })
      )
      .toEqual([]);
    });
  });
});
