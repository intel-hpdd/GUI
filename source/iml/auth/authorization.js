//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import {CACHE_INITIAL_DATA} from '../environment.js';

const session = CACHE_INITIAL_DATA.session;

export const authorization = {
  readEnabled: session.read_enabled,
  groupAllowed: function groupAllowed (groupName) {

    const hasGroups = session.user && Array.isArray(session.user.groups);

    return hasGroups && session.user.groups.some(function some (group) {
      //Superusers can do everything.
      if (group.name === GROUPS.SUPERUSERS) return true;

      //Filesystem administrators can do everything a filesystem user can do.
      if (group.name === GROUPS.FS_ADMINS && groupName === GROUPS.FS_USERS) return true;

      // Fallback to matching on names.
      return group.name === groupName;
    });
  }
};

export const GROUPS = Object.freeze({
  SUPERUSERS: 'superusers',
  FS_ADMINS: 'filesystem_administrators',
  FS_USERS: 'filesystem_users'
});

export function restrictTo (authorization) {
  'ngInject';

  return {
    link: function link ($scope, el, attrs) {
      if (!authorization.groupAllowed(attrs.restrictTo))
        el.addClass('invisible');
    }
  };
}

export function restrict (authorization) {
  'ngInject';

  return {
    link: function link ($scope, el, attrs) {
      if (authorization.groupAllowed(attrs.restrict))
        el.addClass('invisible');
    }
  };
}
