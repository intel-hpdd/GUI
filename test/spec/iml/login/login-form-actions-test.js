// @flow

import {
  addUsername,
  addPassword
} from '../../../../source/iml/login/login-form-actions.js';

import {
  ADD_USERNAME,
  ADD_PASSWORD
} from '../../../../source/iml/login/login-form-reducer.js';

import type {
  usernameT,
  usernameActionT,
  passwordT,
  passwordActionT
} from '../../../../source/iml/login/login-module.js';

describe('login form actions', () => {
  let username:usernameT,
    usernameAction:usernameActionT,
    password:passwordT,
    passwordAction:passwordActionT;
  beforeEach(() => {
    username = {
      username: 'wcjohnso'
    };
    usernameAction = addUsername(username);

    password = {
      password: 'mybigsecret'
    };
    passwordAction = addPassword(password);
  });

  it('should return a username action', () => {
    expect(usernameAction).toEqual({
      type: ADD_USERNAME,
      payload: {
        username: 'wcjohnso'
      }
    });
  });

  it('should return a password action', () => {
    expect(passwordAction).toEqual({
      type: ADD_PASSWORD,
      payload: {
        password: 'mybigsecret'
      }
    });
  });
});
