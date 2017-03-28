// @flow

import {
  addErrors,
  addInProgress
} from '../../../../source/iml/login/login-form-actions.js';

describe('login form actions', () => {
  it('should return an errors action', () => {
    const result = addErrors({
      password: ['bad password'],
      username: ['bad username']
    });

    expect(result).toEqual({
      type: 'ADD_ERRORS',
      payload: {
        password: ['bad password'],
        username: ['bad username']
      }
    });
  });

  it('should return an inProgress action', () => {
    const result = addInProgress(true);

    expect(result).toEqual({
      type: 'ADD_IN_PROGRESS',
      payload: {
        inProgress: true
      }
    });
  });
});
