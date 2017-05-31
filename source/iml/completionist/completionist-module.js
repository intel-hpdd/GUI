// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import completionist from './completionist.js';
import extendScopeModule from '../extend-scope-module.js';
import completionistModelHook from './completionist-model-hook.js';
import completionistDropdown from './completionist-dropdown.js';

export default angular
  .module('completionist', [extendScopeModule])
  .component('completionist', completionist)
  .component('completionistDropdown', completionistDropdown)
  .directive('completionistModelHook', completionistModelHook)
  .name;
