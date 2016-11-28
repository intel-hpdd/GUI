// @flow

import {
  setSession
} from '../../../../source/iml/session/session-actions.js';

import {
  SET_SESSION
} from '../../../../source/iml/session/session-reducer.js';

import type {
  sessionActionT
} from '../../../../source/iml/session/session-reducer.js';

import type {
  sessionT
} from '../../../../source/iml/api-types.js';

describe('session actions', () => {
  let session:sessionT, result:sessionActionT;
  beforeEach(() => {
    session = {
      read_enabled: true,
      resource_uri: '/api/session',
      user: {
        accepted_eula: false,
        alert_subscriptions: [],
        email: 'william.c.johnson@intel.com',
        eula_state: 'pass',
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
        username: 'wcjohnso',
        deleting: false
      }
    };

    result = setSession(session);
  });

  it('should return the session action', () => {
    expect(result).toEqual({
      type: SET_SESSION,
      payload: session
    });
  });
});
