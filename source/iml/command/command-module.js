//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import extendScopeModule from '../extend-scope-module';
import commandMonitorDirective from './command-monitor-directive.js';
import DeferredCommandModalBtnCtrl from './deferred-cmd-modal-btn-controller';
import jobStatesDirective from './job-states-directive';
import jobTreeFactory from './job-tree-factory';
import waitForCommandCompletionFactory from './wait-for-command-completion-service';

import {
  deferredCmdModalBtnDirective
} from './deferred-cmd-modal-btn-directive';

import {
  JobTreeCtrl,
  getJobStreamFactory
} from './job-tree-ctrl';

import {
  StepModalCtrl,
  openStepModalFactory
} from './step-modal-ctrl';

import {
  CommandModalCtrl,
  openCommandModalFactory
} from './command-modal-ctrl';

export default angular.module('command', [
  extendScopeModule
])
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
  .factory('waitForCommandCompletion', waitForCommandCompletionFactory)
  .name;
