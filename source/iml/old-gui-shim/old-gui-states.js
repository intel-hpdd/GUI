// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { GROUPS } from '../auth/authorization.js';

import { oldFilesystemDetailResolve, oldUserDetailResolve, oldTargetResolve } from './old-gui-resolves.js';

export default [
  [
    '/configure/volume',
    'app.oldVolume',
    'configureold/volume',
    'Graphical_User_Interface_9_0.html#9.3.7',
    'Volumes',
    'fa-th',
    {}
  ],
  [
    '/configure/power',
    'app.oldPower',
    'configureold/power',
    'Graphical_User_Interface_9_0.html#9.3.2',
    'Power Control',
    'fa-bolt',
    {}
  ],
  [
    '/configure/filesystem/create',
    'app.oldFilesystemCreate',
    'configureold/filesystem/create',
    'Graphical_User_Interface_9_0.html#9.3.3',
    'Create File System',
    'fa-files-o',
    {}
  ],
  [
    '/configure/filesystem/:id',
    'app.oldFilesystemDetail',
    'configureold/filesystem/detail',
    'Graphical_User_Interface_9_0.html#9.1.1',
    'File System Detail',
    'fa-files-o',
    oldFilesystemDetailResolve
  ],
  [
    '/configure/user',
    'app.oldUser',
    '/configureold/user',
    'Graphical_User_Interface_9_0.html#9.3.6',
    'Users',
    'fa-users',
    {}
  ],
  [
    '/configure/user/:id',
    'app.oldUserDetail',
    '/userold',
    'Graphical_User_Interface_9_0.html#9.3.6',
    'User detail',
    'fa-user',
    oldUserDetailResolve
  ],
  ['/target/:id', 'app.oldTarget', '/targetold', '', 'Target Detail', 'fa-bullseye', oldTargetResolve],
  ['/system_status', 'app.oldSystemStatus', '/system_statusold', '', 'System status', 'fa-database', {}]
].map(([url, name, path, helpPage, kind, icon, resolve]) => {
  return Object.assign({
    url,
    name,
    controller: function($stateParams) {
      'ngInject';
      this.params = $stateParams;
    },
    controllerAs: '$ctrl',
    template: `
      <iframe-shim params="::$ctrl.params" path="${path}"></iframe-shim>
      `,
    params: {
      resetState: {
        dynamic: true
      }
    },
    data: {
      helpPage,
      access: GROUPS.FS_ADMINS,
      anonymousReadProtected: true,
      kind,
      icon,
      noSpinner: true
    },
    ...resolve
  });
});
