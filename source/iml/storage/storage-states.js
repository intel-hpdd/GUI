// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { storageB, alertIndicatorB, getData, storageResource$ } from './storage-resolves.js';

import { GROUPS } from '../auth/authorization.js';

export const addStorageState = {
  name: 'app.addStorage',
  url: '/configure/storage/add',
  params: {
    resetState: {
      dynamic: true
    }
  },
  data: {
    helpPage: 'Graphical_User_Interface_9_0.html#9.3.5',
    access: GROUPS.FS_ADMINS,
    kind: 'Add Storage Device',
    icon: 'fa-hdd-o'
  },
  resolve: { storageB },
  component: 'addStorage'
};

export const storageState = {
  name: 'app.storage',
  url: '/configure/storage',
  params: {
    resetState: {
      dynamic: true
    }
  },
  data: {
    helpPage: 'Graphical_User_Interface_9_0.html#9.3.5',
    access: GROUPS.FS_ADMINS,
    kind: 'Storage',
    icon: 'fa-hdd-o'
  },
  resolve: { storageB, alertIndicatorB },
  component: 'storage'
};

export const storageDetailState = {
  name: 'app.storageDetail',
  url: '/configure/storage/:id',
  params: {
    resetState: {
      dynamic: true
    }
  },
  data: {
    helpPage: 'Graphical_User_Interface_9_0.html#9.3.5',
    access: GROUPS.FS_ADMINS,
    kind: 'Storage Detail',
    icon: 'fa-hdd-o'
  },
  resolve: {
    getData,
    storageResource$,
    alertIndicatorB
  },
  component: 'storageDetail'
};
