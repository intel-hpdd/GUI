// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import multiToggleContainerComponent from './multi-toggler-container-component.js';
import multiTogglerComponent from './multi-toggler-component.js';
import multiTogglerModelDirective from './multi-toggler-model-directive.js';

export default angular
  .module('multiToggler', [])
  .component('multiTogglerContainer', multiToggleContainerComponent)
  .component('multiToggler', multiTogglerComponent)
  .directive('multiTogglerModel', multiTogglerModelDirective).name;
