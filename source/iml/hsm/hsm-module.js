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

import angular from 'angular';
import progressCircleModule from '../progress-circle/progress-circle-module';
import commandModule from '../command/command-module';
import agentVsCopytoolModule
  from '../agent-vs-copytool/agent-vs-copytool-module';
import helpModule from '../help-module';
import configToggleModule from '../config-toggle/config-toggle-module';
import HsmCtrl from './hsm-controller';
import hsmCdtStatusDirective from './hsm-cdt-status-directive';

import {
  AddCopytoolModalCtrl,
  openAddCopytoolModalFactory
} from './add-copytool-modal';

export default angular
  .module('hsm', [
    progressCircleModule,
    commandModule,
    helpModule,
    agentVsCopytoolModule,
    configToggleModule
  ])
  .factory('openAddCopytoolModal', openAddCopytoolModalFactory)
  .controller('AddCopytoolModalCtrl', AddCopytoolModalCtrl)
  .controller('HsmCtrl', HsmCtrl)
  .directive('hsmCdtStatus', hsmCdtStatusDirective).name;
