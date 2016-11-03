// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import {
  getData,
  fsCollStream
} from './hsm-fs-resolves.js';

import hsmFsTemplate from './assets/html/hsm-fs.html!text';
import hsmTemplate from './assets/html/hsm.html!text';

import {
  copytoolStream,
  copytoolOperationStream,
  agentVsCopytoolChart
} from './hsm-resolves.js';

import {
  GROUPS
} from '../auth/authorization.js';

export const hsmFsState = {
  name: 'app.hsmFs',
  controller: 'HsmFsCtrl',
  controllerAs: 'hsmFs',
  template: hsmFsTemplate,
  data: {
    helpPage: 'hsm_page.htm',
    access: GROUPS.FS_ADMINS,
    anonymousReadProtected: true,
    eulaState: true
  },
  resolve: {
    fsStream: fsCollStream
  }
};

export const hsmState = {
  url: '/configure/hsm/:fsId',
  name: 'app.hsmFs.hsm',
  params: {
    fsId: {
      value: null,
      dynamic: false,
      squash: true
    },
    resetState: {
      dynamic: true
    }
  },
  data: {
    kind: 'HSM',
    icon: 'fa-files-o'
  },
  controller: 'HsmCtrl',
  controllerAs: 'hsm',
  template: hsmTemplate,
  resolve: {
    getData,
    copytoolOperationStream,
    copytoolStream,
    agentVsCopytoolChart
  }
};
