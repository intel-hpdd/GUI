// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { GROUPS } from '../auth/authorization.js';

import {
  oldFilesystemDetailResolve,
  oldUserDetailResolve,
  oldTargetResolve,
  oldStoragePluginResolve
} from './old-gui-resolves.js';

export default [
  [
    '/configure/volume',
    'app.oldVolume',
    'configureold/volume',
    'volumes_tab.htm',
    'Volumes',
    'fa-th',
    {}
  ],
  [
    '/configure/power',
    'app.oldPower',
    'configureold/power',
    'power_control_tab.htm',
    'Power Control',
    'fa-bolt',
    {}
  ],
  [
    '/configure/filesystem/create',
    'app.oldFilesystemCreate',
    'configureold/filesystem/create',
    'creating_a_file_system2.htm',
    'Create File System',
    'fa-files-o',
    {}
  ],
  [
    '/configure/filesystem/:id',
    'app.oldFilesystemDetail',
    'configureold/filesystem/detail',
    'file_systems_details_page.htm',
    'File System Detail',
    'fa-files-o',
    oldFilesystemDetailResolve
  ],
  [
    '/configure/user',
    'app.oldUser',
    '/configureold/user',
    'users_tab.htm',
    'Users',
    'fa-users',
    {}
  ],
  [
    '/configure/user/:id',
    'app.oldUserDetail',
    '/userold',
    'users_tab.htm',
    'User detail',
    'fa-user',
    oldUserDetailResolve
  ],
  [
    '/target/:id',
    'app.oldTarget',
    '/targetold',
    '',
    'Target Detail',
    'fa-bullseye',
    oldTargetResolve
  ],
  [
    '/system_status',
    'app.oldSystemStatus',
    '/system_statusold',
    '',
    'System status',
    'fa-database',
    {}
  ],
  [
    '/configure/storage',
    'app.oldStorageResource',
    '/configureold/storage/',
    'storage_tab.htm',
    'Storage',
    'fa-hdd-o',
    {}
  ],
  [
    '/configure/storage/:id',
    'app.oldStorageResourceDetail',
    '/storage_resourceold',
    'storage_tab.htm',
    'Storage Detail',
    'fa-hdd-o',
    oldStoragePluginResolve
  ]
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
      eulaState: true,
      kind,
      icon,
      noSpinner: true
    },
    ...resolve
  });
});
