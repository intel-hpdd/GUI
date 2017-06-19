import alertIndicatorReducer from '../../../../source/iml/alert-indicator/alert-indicator-reducer.js';
import deepFreeze from '@mfl/deep-freeze';

describe('alert indicator reducer', () => {
  it('should be a function', () => {
    expect(alertIndicatorReducer).toEqual(expect.any(Function));
  });

  it('should return the payload on ADD_ALERT_INDICATOR_ITEMS', () => {
    expect(
      alertIndicatorReducer(deepFreeze([]), {
        type: 'ADD_ALERT_INDICATOR_ITEMS',
        payload: [{}]
      })
    ).toEqual([{}]);
  });

  it('should return state on non-matching type', () => {
    expect(
      alertIndicatorReducer(deepFreeze([]), {
        type: 'FOO',
        payload: [{ bar: 'baz' }]
      })
    ).toEqual([]);
  });
});
