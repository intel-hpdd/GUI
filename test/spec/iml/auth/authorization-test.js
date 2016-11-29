// @flow

import {
  GROUPS
} from '../../../../source/iml/auth/authorization.js';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('The authorization service', () => {
  let authorization, store, setSession;

  beforeEachAsync(async () => {
    store = {
      select: jasmine.createSpy('select'),
      each: jasmine.createSpy('each')
    };

    store
      .select
      .and
      .returnValue(store);

    authorization = await mock('source/iml/auth/authorization.js', {
      'source/iml/store/get-store.js': { default: store }
    });

    setSession = store.each.calls.argsFor(0)[0];
  });

  afterEach(resetAll);

  it('should select the session store', () => {
    expect(store.select).toHaveBeenCalledOnceWith('session');
  });

  it('should call each', () => {
    expect(store.each).toHaveBeenCalledOnceWith(jasmine.any(Function));
  });

  it('should tell if superusers are allowed', () => {
    setSession({
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
    setSession({
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
    setSession({
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
    setSession({
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
    setSession({
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
    setSession({
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
