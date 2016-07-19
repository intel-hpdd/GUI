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


import {
  invoke,
  __
} from 'intel-fp';

import {
  GROUPS
} from '../auth/authorization.js';

// $FlowIgnore: HTML templates that flow does not recognize.
import serverTemplate from './assets/html/server';

// $FlowIgnore: HTML templates that flow does not recognize.
import serverDetailTemplate from './assets/html/server-detail';

export const serverState = {
  name: 'app.server',
  url: '/configure/server',
  controller: 'ServerCtrl',
  templateUrl: serverTemplate,
  data: {
    helpPage: 'server_tab.htm',
    access: GROUPS.FS_ADMINS,
    anonymousReadProtected: true,
    eulaState: true
  },
  resolve: {
    streams: ['serverResolves', invoke(__, [])]
  }
};

export const serverDetailState = {
  name: 'app.serverDetail',
  url: '/configure/server/:id',
  params: {
    id: {
      dynamic: false
    }
  },
  controller: 'ServerDetailController',
  controllerAs: 'serverDetail',
  templateUrl: serverDetailTemplate,
  data: {
    helpPage: 'server_detail_page.htm',
    access: GROUPS.FS_ADMINS,
    anonymousReadProtected: true,
    eulaState: true
  },
  resolve: {
    streams: ['serverDetailResolves', invoke(__, [])]
  }
};
