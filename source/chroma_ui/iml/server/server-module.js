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

import angular from 'angular';

import ServerCtrl from './server-controller-exports';
import serverActionsFactory from './server-actions-exports';
import serverResolvesFactory from './server-resolves-exports';
import ConfirmServerActionModalCtrl from './confirm-server-action-modal-ctrl-exports';
import {ADD_SERVER_AUTH_CHOICES, AddServerStepCtrl, addServersStepFactory}
  from './add-server-step-exports';
import {SelectServerProfileStepCtrl, selectServerProfileStep} from './select-server-profile-step-exports';
import ServerDetailController from './server-detail-controller-exports';

export default angular.module('server', ['pdsh-parser-module', 'pdsh-module', 'filters', 'lnetModule',
    'corosyncModule', 'pacemaker', 'socket-module', 'command', 'action-dropdown-module',
    'jobIndicator', 'alertIndicator', 'steps-module', 'extendScope', 'highland', 'asValue', 'asStream'
  ])
  .controller('ServerCtrl', ServerCtrl)
  .controller('ConfirmServerActionModalCtrl', ConfirmServerActionModalCtrl)
  .factory('serverActions', serverActionsFactory)
  .factory('serverResolves', serverResolvesFactory)
  .constant('ADD_SERVER_AUTH_CHOICES', ADD_SERVER_AUTH_CHOICES)
  .controller('AddServerStepCtrl', AddServerStepCtrl)
  .factory('addServersStep', addServersStepFactory)
  .controller('SelectServerProfileStepCtrl', SelectServerProfileStepCtrl)
  .factory('selectServerProfileStep', selectServerProfileStep)
  .controller('ServerDetailController', ServerDetailController)
  .name;
