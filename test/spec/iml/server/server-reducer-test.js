import {
  ADD_SERVER_ITEMS,
  default as serverReducer
} from '../../../../source/iml/server/server-reducer.js';
import deepFreeze from '@mfl/deep-freeze';

describe('server reducer', () => {
  it('should be a function', () => {
    expect(serverReducer).toEqual(expect.any(Function));
  });

  describe('matching type', () => {
    it('should return the payload', () => {
      expect(
        serverReducer(deepFreeze([]), {
          type: ADD_SERVER_ITEMS,
          payload: [{}]
        })
      ).toEqual([{}]);
    });
  });

  describe('non-matching type', () => {
    it('should return the state', () => {
      expect(
        serverReducer(deepFreeze([]), {
          type: 'ADD_ALERT_INDICATOR_ITEMS',
          payload: { key: 'val' }
        })
      ).toEqual([]);
    });
  });
});
