//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import positionModule from '../position/position-module';
import helpModule from '../help-module';
import uiBootstrapModule from 'angular-ui-bootstrap';
import strategiesFactory from './strategies';

import {imlTooltip, helpTooltip} from './tooltip';

export default angular.module('iml-tooltip', [
  positionModule, helpModule,
  uiBootstrapModule
])
.directive('imlTooltip', imlTooltip)
.directive('helpTooltip', helpTooltip)
.factory('strategies', strategiesFactory)
.name;
