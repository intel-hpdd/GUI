// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import uiBootstrapModule from 'angular-ui-bootstrap';
import highlandModule from '../highland/highland-module.js';
import popoverModule from '../popover/popover-module.js';
import tooltipModule from '../tooltip/tooltip-module.js';
import extendScopeModule from '../extend-scope-module.js';
import jobStatusDirective from './job-indicator.js';

export const ADD_JOB_INDICATOR_ITEMS = 'ADD_JOB_INDICATOR_ITEMS';

export default angular
  .module('jobIndicator', [
    popoverModule,
    uiBootstrapModule,
    tooltipModule,
    extendScopeModule,
    highlandModule
  ])
  .directive('jobStatus', jobStatusDirective).name;
