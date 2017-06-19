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
import extendScopeModule from '../extend-scope-module';
import commandMonitorDirective from './command-monitor-directive.js';
import DeferredCommandModalBtnCtrl from './deferred-cmd-modal-btn-controller';
import jobStatesDirective from './job-states-directive';
import jobTreeFactory from './job-tree-factory';
import waitForCommandCompletionFactory from './wait-for-command-completion-service';

import { deferredCmdModalBtnDirective } from './deferred-cmd-modal-btn-directive';

import { JobTreeCtrl, getJobStreamFactory } from './job-tree-ctrl';

import { StepModalCtrl, openStepModalFactory } from './step-modal-ctrl';

import {
  CommandModalCtrl,
  openCommandModalFactory
} from './command-modal-ctrl';

export default angular
  .module('command', [extendScopeModule])
  .controller('DeferredCommandModalBtnCtrl', DeferredCommandModalBtnCtrl)
  .directive('commandMonitor', commandMonitorDirective)
  .controller('CommandModalCtrl', CommandModalCtrl)
  .factory('openCommandModal', openCommandModalFactory)
  .directive('deferredCmdModalBtn', deferredCmdModalBtnDirective)
  .controller('JobTreeCtrl', JobTreeCtrl)
  .factory('getJobStream', getJobStreamFactory)
  .controller('StepModalCtrl', StepModalCtrl)
  .factory('openStepModal', openStepModalFactory)
  .directive('jobStates', jobStatesDirective)
  .factory('jobTree', jobTreeFactory)
  .factory('waitForCommandCompletion', waitForCommandCompletionFactory).name;
