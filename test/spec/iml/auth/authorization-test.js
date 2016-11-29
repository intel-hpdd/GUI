// @flow

import {
  GROUPS
} from '../../../../source/iml/auth/authorization.js';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

import highland from 'highland';

describe('The authorization service', () => {
  let authorization, store, session$;

  beforeEachAsync(async () => {
    session$ = highland();
    store = {
      select: jasmine.createSpy('select')
        .and
        .returnValue(session$)
    };

    authorization = await mock('source/iml/auth/authorization.js', {
      'source/iml/store/get-store.js': { default: store }
    });
  });

  afterEach(resetAll);

  it('should select the session store', () => {
    expect(store.select).toHaveBeenCalledOnceWith('session');
  });

  it('should tell if superusers are allowed', () => {
    session$.write({
      session: {
        user: {
          groups: [
            {
              name: GROUPS.SUPERUSERS
            }
          ]
        }
      }
    });

    expect(authorization.groupAllowed(GROUPS.SUPERUSERS)).toBe(true);
  });

  it('should tell if superusers are not allowed', () => {
    session$.write({
      session: {
        user: {
          groups: [
            {
              name: GROUPS.FS_ADMINS
            }
          ]
        }
      }
    });

    expect(authorization.groupAllowed(GROUPS.SUPERUSERS)).toBe(false);
  });

  it('should allow a superuser when fs admin is checked', () => {
    session$.write({
      session: {
        user: {
          groups: [
            {
              name: GROUPS.SUPERUSERS
            }
          ]
        }
      }
    });

    expect(authorization.groupAllowed(GROUPS.FS_ADMINS)).toBe(true);
  });

  it('should allow a fs admin when fs user is checked', () => {
    session$.write({
      session: {
        user: {
          groups: [
            {
              name: GROUPS.FS_ADMINS
            }
          ]
        }
      }
    });

    expect(authorization.groupAllowed(GROUPS.FS_USERS)).toBe(true);
  });

  it('should disallow a fs admin when superuser is checked', () => {
    session$.write({
      session: {
        user: {
          groups: [
            {
              name: GROUPS.FS_ADMINS
            }
          ]
        }
      }
    });

    expect(authorization.groupAllowed(GROUPS.SUPERUSERS)).toBe(false);
  });

  it('should allow a fs user when fs user is checked', () => {
    session$.write({
      session: {
        user: {
          groups: [
            {
              name: GROUPS.FS_USERS
            }
          ]
        }
      }
    });

    expect(authorization.groupAllowed(GROUPS.FS_USERS)).toBe(true);
  });
});
