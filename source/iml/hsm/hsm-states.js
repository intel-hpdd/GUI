// @flow

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
  getData,
  fsCollStream
} from './hsm-fs-resolves.js';

// $FlowIgnore: HTML templates that flow does not recognize.
import hsmFsTemplate from './assets/html/hsm-fs.html!text';

// $FlowIgnore: HTML templates that flow does not recognize.
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
