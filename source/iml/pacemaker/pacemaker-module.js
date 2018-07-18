// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import extendScopeModule from '../extend-scope-module';
import asValueModule from '../as-value/as-value-module';

import configurePacemakerDirective from './configure-pacemaker';
import PacemakerStateComponent from './pacemaker-state';

export default angular
  .module('pacemaker', [extendScopeModule, asValueModule])
  .directive('configurePacemaker', configurePacemakerDirective)
  .component('pacemakerState', PacemakerStateComponent).name;
