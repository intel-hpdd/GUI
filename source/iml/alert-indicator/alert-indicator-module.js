// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import uiBootstrapModule from 'angular-ui-bootstrap';
import highlandModule from '../highland/highland-module.js';
import popoverModule from '../popover/popover-module.js';
import extendScopeModule from '../extend-scope-module.js';
import { RecordStateCtrl, recordStateDirective } from './alert-indicator.js';

export default angular
  .module('alertIndicator', [
    popoverModule,
    uiBootstrapModule,
    highlandModule,
    extendScopeModule
  ])
  .controller('RecordStateCtrl', RecordStateCtrl)
  .directive('recordState', recordStateDirective)
  .constant('STATE_SIZE', {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large'
  }).name;
