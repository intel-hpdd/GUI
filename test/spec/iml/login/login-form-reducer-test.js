// @flow

import {
  ADD_USERNAME,
  ADD_PASSWORD,
  default as loginFormReducer
} from '../../../../source/iml/login/login-form-reducer.js';
import deepFreeze from 'intel-deep-freeze';

import type {
  loginFormT
} from '../../../../source/iml/login/login-module.js';

describe('login form reducer', () => {
  let loginForm:loginFormT;
  beforeEach(() => {
    loginForm = {
      username: 'wcjohnso',
      password: 'mybigsecret'
    };
  });

  it('should be a function', () => {
    expect(loginFormReducer)
      .toEqual(jasmine.any(Function));
  });

  describe('matching type', () => {
    it('should return the username payload', () => {
      expect(loginFormReducer(deepFreeze(loginForm), {
        type: ADD_USERNAME,
        payload: {}
      })).toEqual({
        username: 'wcjohnso',
        password: 'mybigsecret'
      });
    });

    it('should return the password payload', () => {
      expect(loginFormReducer(deepFreeze(loginForm), {
        type: ADD_PASSWORD,
        payload: {}
      })).toEqual({
        username: 'wcjohnso',
        password: 'mybigsecret'
      });
    });
  });

  describe('non-matching type', () => {
    it('should return the state', () => {
      expect(
        loginFormReducer(
        deepFreeze(loginForm), {
          type: 'ADD_ALERT_INDICATOR_ITEMS',
          payload: {key: 'val'}
        })
      )
      .toEqual({
        username: 'wcjohnso',
        password: 'mybigsecret'
      });
    });
  });
});
