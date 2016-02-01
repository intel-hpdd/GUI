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
import agentVsCopytoolModule from '../agent-vs-copytool/agent-vs-copytool-module';
import helpModule from '../help-module';
import configToggleModule from '../config-toggle/config-toggle-module';
import {
  AddCopytoolModalCtrl, openAddCopytoolModalFactory
}
  from './add-copytool-modal';
import HsmCtrl from './hsm-controller';
import getCopytoolOperationStreamFactory from './get-copytool-operation-stream';
import getCopytoolStreamFactory from './get-copytool-stream';
import hsmCdtStatusDirective from './hsm-cdt-status-directive';
import {copytoolOperationStream, copytoolStream, agentVsCopytoolChartResolve} from './hsm-resolves';

// $FlowIgnore: HTML templates that flow does not recognize.
import canceledTemplate from './assets/html/states/canceled';

// $FlowIgnore: HTML templates that flow does not recognize.
import erroredTemplate from './assets/html/states/errored';

// $FlowIgnore: HTML templates that flow does not recognize.
import idleTemplate from './assets/html/states/idle';

// $FlowIgnore: HTML templates that flow does not recognize.
import runningTemplate from './assets/html/states/running';

// $FlowIgnore: HTML templates that flow does not recognize.
import startedTemplate from './assets/html/states/started';

// $FlowIgnore: HTML templates that flow does not recognize.
import stoppedTemplate from './assets/html/states/stopped';

// $FlowIgnore: HTML templates that flow does not recognize.
import unconfiguredTemplate from './assets/html/states/unconfigured';

// $FlowIgnore: HTML templates that flow does not recognize.
import workingTemplate from './assets/html/states/working';

// $FlowIgnore: HTML templates that flow does not recognize.
import archiveTemplate from './assets/html/ops/archive';

// $FlowIgnore: HTML templates that flow does not recognize.
import removeTemplate from './assets/html/ops/remove';

// $FlowIgnore: HTML templates that flow does not recognize.
import restoreTemplate from './assets/html/ops/restore';

// $FlowIgnore: HTML templates that flow does not recognize.
import cdtStatusTemplate from './assets/html/cdt-status';

// $FlowIgnore: HTML templates that flow does not recognize.
import addCopytoolModalTemplate from './assets/html/add-copytool-modal';

// $FlowIgnore: HTML templates that flow does not recognize.
import agentBinaryTemplate from './assets/html/modal-tooltips/agent-binary-tooltip';

// $FlowIgnore: HTML templates that flow does not recognize.
import archiveTooltipTemplate from './assets/html/modal-tooltips/archive-tooltip';

// $FlowIgnore: HTML templates that flow does not recognize.
import mountpointTooltipTemplate from './assets/html/modal-tooltips/mountpoint-tooltip';

// $FlowIgnore: HTML templates that flow does not recognize.
import disabledTemplate from './assets/html/cdt-status/disabled';

// $FlowIgnore: HTML templates that flow does not recognize.
import enabledTemplate from './assets/html/cdt-status/enabled';

// $FlowIgnore: HTML templates that flow does not recognize.
import nullTemplate from './assets/html/cdt-status/null';

// $FlowIgnore: HTML templates that flow does not recognize.
import shutdownTemplate from './assets/html/cdt-status/shutdown';

export default angular.module('hsm', [
  progressCircleModule, commandModule,
  helpModule, agentVsCopytoolModule,
  configToggleModule, cdtStatusTemplate,
  addCopytoolModalTemplate, canceledTemplate,
  erroredTemplate, idleTemplate,
  runningTemplate, startedTemplate,
  stoppedTemplate, unconfiguredTemplate,
  workingTemplate, archiveTemplate,
  removeTemplate, restoreTemplate,
  agentBinaryTemplate, archiveTooltipTemplate,
  mountpointTooltipTemplate, disabledTemplate,
  enabledTemplate, nullTemplate, shutdownTemplate
])
  .factory('openAddCopytoolModal', openAddCopytoolModalFactory)
  .controller('AddCopytoolModalCtrl', AddCopytoolModalCtrl)
  .controller('HsmCtrl', HsmCtrl)
  .factory('copytoolOperationStream', copytoolOperationStream)
  .factory('copytoolStream', copytoolStream)
  .factory('agentVsCopytoolChartResolve', agentVsCopytoolChartResolve)
  .factory('getCopytoolOperationStream', getCopytoolOperationStreamFactory)
  .factory('getCopytoolStream', getCopytoolStreamFactory)
  .directive('hsmCdtStatus', hsmCdtStatusDirective)
  .name;
