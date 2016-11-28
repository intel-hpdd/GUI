// @flow

import loginFormReducer from '../../../../source/iml/login/login-form-reducer.js';

describe('login form reducer', () => {
  it('should return the initial state', () => {
    expect(loginFormReducer(undefined, {
      type: 'ADD_ALERT_INDICATOR_ITEMS',
      payload: {
        key: 'val'
      }
    }))
      .toEqual({
        inProgress: false
      });
  });

  it('should return the errors payload', () => {
    expect(
      loginFormReducer(
        undefined,
        {
          type: 'ADD_ERRORS',
          payload: {
            __all__: 'something bad happened'
          }
        }
      )
    )
    .toEqual({
      __all__: 'something bad happened'
    });
  });

  it('should return the inProgress payload', () => {
    expect(
      loginFormReducer(
        undefined,
        {
          type: 'ADD_IN_PROGRESS',
          payload: {
            inProgress: true
          }
        }
      )
    )
    .toEqual({
      inProgress: true
    });
  });
});
