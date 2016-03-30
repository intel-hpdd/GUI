import alertIndicatorModule from '../../../../source/iml/alert-indicator/alert-indicator-module.js';
import deepFreeze from 'intel-deep-freeze';

describe('alert indicator reducer', () => {
  beforeEach(module(alertIndicatorModule));

  var alertIndicatorReducer;

  beforeEach(inject(_alertIndicatorReducer_ => {
    alertIndicatorReducer = _alertIndicatorReducer_;
  }));

  it('should be a function', () => {
    expect(alertIndicatorReducer).toEqual(jasmine.any(Function));
  });

  it('should return the payload on ADD_ALERT_INDICATOR_ITEMS', () => {
    expect(alertIndicatorReducer(deepFreeze([]), {
      type: 'ADD_ALERT_INDICATOR_ITEMS',
      payload: [{}]
    })).toEqual([{}]);
  });

  it('should return state on non-matching type', () => {
    expect(alertIndicatorReducer(deepFreeze([]), {
      type: 'FOO',
      payload: [{bar: 'baz'}]
    })).toEqual([]);
  });
});
