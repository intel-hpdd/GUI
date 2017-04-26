// @flow

import {
  default as sessionReducer
} from '../../../../source/iml/session/session-reducer.js';

import type { sessionT } from '../../../../source/iml/api-types.js';

import deepFreeze from '@mfl/deep-freeze';

describe('session reducer', () => {
  let session: sessionT;
  beforeEach(() => {
    session = {
      read_enabled: true,
      resource_uri: '/api/session',
      user: {
        accepted_eula: false,
        alert_subscriptions: [{}],
        email: 'william.c.johnson@intel.com',
        eula_state: 'eula',
        first_name: 'Will',
        full_name: 'William Johnson',
        groups: [],
        gui_config: {},
        id: '1',
        is_superuser: true,
        last_name: 'Johnson',
        new_password1: undefined,
        new_password2: undefined,
        password1: undefined,
        password2: undefined,
        resource_uri: '/api/user/1',
        roles: 'role',
        username: 'wcjohnso'
      }
    };
  });

  it('should be a function', () => {
    expect(sessionReducer).toEqual(jasmine.any(Function));
  });

  describe('matching type', () => {
    it('should return the payload', () => {
      expect(
        sessionReducer(deepFreeze({ session }), {
          type: 'SET_SESSION',
          payload: {
            session
          }
        })
      ).toEqual({ session });
    });
  });

  describe('non-matching type', () => {
    it('should return the state', () => {
      expect(
        sessionReducer(deepFreeze({ session }), {
          type: 'ADD_ALERT_INDICATOR_ITEMS',
          payload: {}
        })
      ).toEqual({ session });
    });
  });
});
