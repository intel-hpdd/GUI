// @flow

import {
  setSession,
  setCookie
} from '../../../../source/iml/session/session-actions.js';

import {
  SET_SESSION,
  SET_COOKIE
} from '../../../../source/iml/session/session-reducer.js';

import type {
  sessionActionT,
  cookieActionT
} from '../../../../source/iml/session/session-reducer.js';

import type {
  sessionT
} from '../../../../source/iml/api-types.js';

describe('session actions', () => {
  let session:sessionT, sessionResult:sessionActionT,
    cookie:string, cookieResult:cookieActionT;
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

    cookie = 'sessionid=9b834e1b19ea103bcf7717cafc699e48; expires=Tue, 13-Dec-2016 17:00:49 GMT; Max-Age=1209600; Path=/';

    sessionResult = setSession(session);
    cookieResult = setCookie(cookie);
  });

  it('should return the session action', () => {
    expect(sessionResult).toEqual({
      type: SET_SESSION,
      payload: {
        session
      }
    });
  });

  it('should return the cookie action', () => {
    expect(cookieResult).toEqual({
      type: SET_COOKIE,
      payload: {
        cookie
      }
    });
  });
});
