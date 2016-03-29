import targetModule from '../../../../source/iml/target/target-module.js';
import deepFreeze from 'intel-deep-freeze';

describe('target reducer', () => {
  beforeEach(module(targetModule));

  var targetReducer;

  beforeEach(inject(_targetReducer_ => {
    targetReducer = _targetReducer_;
  }));

  it('should be a function', () => {
    expect(targetReducer).toEqual(jasmine.any(Function));
  });

  it('should return the payload on ADD_TARGET_ITEMS', () => {
    expect(targetReducer(deepFreeze([]), {
      type: 'ADD_TARGET_ITEMS',
      payload: [{}]
    })).toEqual([{}]);
  });

  it('should return state on non-matching type', () => {
    expect(targetReducer(deepFreeze([]), {
      type: 'FOO',
      payload: [{bar: 'baz'}]
    })).toEqual([]);
  });
});
