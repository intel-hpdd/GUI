import {
  ADD_FS_ITEMS,
  default as fileSystemReducer
} from '../../../../source/iml/file-system/file-system-reducer.js';
import deepFreeze from 'intel-deep-freeze';

describe('file system reducer', () => {
  it('should be a function', () => {
    expect(fileSystemReducer).toEqual(jasmine.any(Function));
  });

  describe('matching type', () => {
    it('should return the payload', () => {
      expect(
        fileSystemReducer(deepFreeze([]), {
          type: ADD_FS_ITEMS,
          payload: [{}]
        })
      ).toEqual([{}]);
    });
  });

  describe('non-matching type', () => {
    it('should return the state', () => {
      expect(
        fileSystemReducer(deepFreeze([]), {
          type: 'ADD_ALERT_INDICATOR_ITEMS',
          payload: {
            key: 'val'
          }
        })
      ).toEqual([]);
    });
  });
});
