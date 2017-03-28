import targetReducer from '../../../../source/iml/target/target-reducer.js';
import deepFreeze from 'intel-deep-freeze';

describe('target reducer', () => {
  it('should be a function', () => {
    expect(targetReducer).toEqual(jasmine.any(Function));
  });

  it('should return the payload on ADD_TARGET_ITEMS', () => {
    expect(
      targetReducer(deepFreeze([]), {
        type: 'ADD_TARGET_ITEMS',
        payload: [{}]
      })
    ).toEqual([{}]);
  });

  it('should return state on non-matching type', () => {
    expect(
      targetReducer(deepFreeze([]), {
        type: 'FOO',
        payload: [{ bar: 'baz' }]
      })
    ).toEqual([]);
  });
});
