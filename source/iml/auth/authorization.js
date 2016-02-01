//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

export function Authorization (CACHE_INITIAL_DATA) {
  'ngInject';

  var session = CACHE_INITIAL_DATA.session;

  this.readEnabled = session.read_enabled;

  this.groupAllowed = function groupAllowed (groupName) {
    var hasGroups = session.user && Array.isArray(session.user.groups);

    return hasGroups && session.user.groups.some(function some (group) {
      //Superusers can do everything.
      if (group.name === GROUPS.SUPERUSERS) return true;

      //Filesystem administrators can do everything a filesystem user can do.
      if (group.name === GROUPS.FS_ADMINS && groupName === GROUPS.FS_USERS) return true;

      // Fallback to matching on names.
      return group.name === groupName;
    });
  };
}

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
