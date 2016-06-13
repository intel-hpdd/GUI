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
import extractApiFilterModule from '../extract-api-filter/extract-api-filter-module.js';
import actionDropdownModule from '../action-dropdown/action-dropdown-module.js';
import alertIndicatorModule from '../alert-indicator/alert-indicator-module.js';
import jobIndicatorModule from '../job-indicator/job-indicator-module.js';
import asStreamModule from '../as-stream/as-stream-module.js';
import asValueModule from '../as-value/as-value-module.js';
import routeToModule from '../route-to/route-to-module.js';
import mgtComponent from './mgt-component.js';
import {mgtAlertIndicatorStream, mgtJobIndicatorStream, mgtStream} from './mgt-resolves.js';

export default angular.module('mgtModule', [
  extractApiFilterModule, actionDropdownModule,
  alertIndicatorModule, jobIndicatorModule,
  asStreamModule, routeToModule,
  asValueModule
])
  .component('mgt', mgtComponent)
  .factory('mgtAlertIndicatorStream', mgtAlertIndicatorStream)
  .factory('mgtJobIndicatorStream', mgtJobIndicatorStream)
  .factory('mgtStream', mgtStream)
  .name;
