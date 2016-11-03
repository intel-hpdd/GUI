//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import serverResolves from './server-resolves.js';
import {
  default as serverDetailResolves,
  getData
} from './server-detail-resolves.js';

import {
  GROUPS
} from '../auth/authorization.js';

import serverTemplate from './assets/html/server.html!text';
import serverDetailTemplate from './assets/html/server-detail.html!text';

export const serverState = {
  name: 'app.server',
  url: '/configure/server',
  controller: 'ServerCtrl',
  template: serverTemplate,
  data: {
    helpPage: 'server_tab.htm',
    access: GROUPS.FS_ADMINS,
    anonymousReadProtected: true,
    eulaState: true,
    kind: 'Servers',
    icon: 'fa-tasks'
  },
  params: {
    resetState: {
      dynamic: true
    }
  },
  resolve: {
    streams: serverResolves
  }
};

export const serverDetailState = {
  name: 'app.serverDetail',
  url: '/configure/server/:id',
  controller: 'ServerDetailController',
  controllerAs: 'serverDetail',
  template: serverDetailTemplate,
  params: {
    resetState: {
      dynamic: true
    }
  },
  data: {
    helpPage: 'server_detail_page.htm',
    access: GROUPS.FS_ADMINS,
    anonymousReadProtected: true,
    eulaState: true,
    kind: 'Server Detail',
    icon: 'fa-tasks'
  },
  resolve: {
    streams: serverDetailResolves,
    getData
  }
};
