// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import extractApiFilterModule from '../extract-api-filter/extract-api-filter-module.js';
import actionDropdownModule from '../action-dropdown/action-dropdown-module.js';
import asStreamModule from '../as-stream/as-stream-module.js';
import asValueModule from '../as-value/as-value-module.js';
import routeToModule from '../route-to/route-to-module.js';
import mgtComponent from './mgt-component.js';
import mgtPageComponent from './mgt-page-component.js';

export default angular
  .module('mgtModule', [extractApiFilterModule, actionDropdownModule, asStreamModule, routeToModule, asValueModule])
  .component('mgt', mgtComponent)
  .component('mgtPage', mgtPageComponent).name;
