// @flow

import highland from 'highland';

describe('The authorization service', () => {
  let authorization, mockStore, session$, GROUPS;

  beforeEach(() => {
    session$ = highland();
    GROUPS = {
      SUPERUSERS: 'superusers',
      FS_ADMINS: 'filesystem_administrators',
      FS_USERS: 'filesystem_users'
    };
    mockStore = { select: jest.fn(() => session$) };
    jest.mock('../../../../source/iml/store/get-store.js', () => mockStore);

    authorization = require('../../../../source/iml/auth/authorization.js');
  });

  it('should select the session store', () => {
    expect(mockStore.select).toHaveBeenCalledOnceWith('session');
  });
  it('should tell if superusers are allowed', () => {
    session$.write({
      session: { user: { groups: [{ name: GROUPS.SUPERUSERS }] } }
    });
    expect(authorization.groupAllowed(GROUPS.SUPERUSERS)).toBe(true);
  });
  it('should tell if superusers are not allowed', () => {
    session$.write({
      session: { user: { groups: [{ name: GROUPS.FS_ADMINS }] } }
    });
    expect(authorization.groupAllowed(GROUPS.SUPERUSERS)).toBe(false);
  });
  it('should allow a superuser when fs admin is checked', () => {
    session$.write({
      session: { user: { groups: [{ name: GROUPS.SUPERUSERS }] } }
    });
    expect(authorization.groupAllowed(GROUPS.FS_ADMINS)).toBe(true);
  });
  it('should allow a fs admin when fs user is checked', () => {
    session$.write({
      session: { user: { groups: [{ name: GROUPS.FS_ADMINS }] } }
    });
    expect(authorization.groupAllowed(GROUPS.FS_USERS)).toBe(true);
  });
  it('should disallow a fs admin when superuser is checked', () => {
    session$.write({
      session: { user: { groups: [{ name: GROUPS.FS_ADMINS }] } }
    });
    expect(authorization.groupAllowed(GROUPS.SUPERUSERS)).toBe(false);
  });
  it('should allow a fs user when fs user is checked', () => {
    session$.write({
      session: { user: { groups: [{ name: GROUPS.FS_USERS }] } }
    });
    expect(authorization.groupAllowed(GROUPS.FS_USERS)).toBe(true);
  });
});
