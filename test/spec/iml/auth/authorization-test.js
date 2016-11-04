import {GROUPS} from '../../../../source/iml/auth/authorization.js';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('The authorization service', function () {
  let authorization, mod, CACHE_INITIAL_DATA;

  beforeEachAsync(async function () {
    CACHE_INITIAL_DATA = {
      session: {
        read_enabled: true,
        user: {
          groups: [
            {id: '1', name: 'superusers', resource_uri: '/api/group/1/'},
            {id: '2', name: 'filesystem_administrators', resource_uri: '/api/group/1/'},
            {id: '3', name: 'filesystem_users', resource_uri: '/api/group/1/'}
          ]
        }
      }
    };

    mod = await mock('source/iml/auth/authorization.js', {
      'source/iml/environment.js': { CACHE_INITIAL_DATA }
    });

    authorization = mod.authorization;
  });

  afterEach(resetAll);

  it('should have a method telling if read is enabled', function () {
    expect(authorization.readEnabled).toBe(true);
  });

  it('should tell if superusers are allowed', function () {
    CACHE_INITIAL_DATA.session.user = {
      groups: [
        {
          name: GROUPS.SUPERUSERS
        }
      ]
    };

    expect(authorization.groupAllowed(GROUPS.SUPERUSERS)).toBe(true);
  });

  it('should tell if superusers are not allowed', function () {
    CACHE_INITIAL_DATA.session.user = {
      groups: [
        {
          name: GROUPS.FS_ADMINS
        }
      ]
    };
    expect(authorization.groupAllowed(GROUPS.SUPERUSERS)).toBe(false);
  });

  it('should allow a superuser when fs admin is checked', function () {
    CACHE_INITIAL_DATA.session.user = {
      groups: [
        {
          name: GROUPS.SUPERUSERS
        }
      ]
    };

    expect(authorization.groupAllowed(GROUPS.FS_ADMINS)).toBe(true);
  });

  it('should allow a fs admin when fs user is checked', function () {
    CACHE_INITIAL_DATA.session.user = {
      groups: [
        {
          name: GROUPS.FS_ADMINS
        }
      ]
    };

    expect(authorization.groupAllowed(GROUPS.FS_USERS)).toBe(true);
  });

  it('should disallow a fs admin when superuser is checked', function () {
    CACHE_INITIAL_DATA.session.user = {
      groups: [
        {
          name: GROUPS.FS_ADMINS
        }
      ]
    };

    expect(authorization.groupAllowed(GROUPS.SUPERUSERS)).toBe(false);
  });

  it('should allow a fs user when fs user is checked', function () {
    CACHE_INITIAL_DATA.session.user = {
      groups: [
        {
          name: GROUPS.FS_USERS
        }
      ]
    };

    expect(authorization.groupAllowed(GROUPS.FS_USERS)).toBe(true);
  });
});
