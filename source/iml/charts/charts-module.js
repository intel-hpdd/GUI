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
import d3Module from '../d3/d3-module';
import nvModule from '../nv/nv-module';
import heatMapModule from '../heat-map/heat-map-module';
import streamWhenVisibleModule
  from '../stream-when-visible/stream-when-visible-module';
import uiBootstrapModule from 'angular-ui-bootstrap';
import baseChart from './base-chart';
import dateTicksFactory from './date-ticks';
import heatMap from './heat-map-chart';
import lineChart from './line-chart';
import multiBarChart from './multi-bar-chart';
import pieGraph from './pie-graph';
import stackedAreaChart from './stacked-area-chart';

export default angular
  .module('charts', [
    d3Module,
    nvModule,
    uiBootstrapModule,
    heatMapModule,
    streamWhenVisibleModule
  ])
  .value('baseChart', baseChart)
  .factory('dateTicks', dateTicksFactory)
  .directive('heatMap', heatMap)
  .directive('lineChart', lineChart)
  .directive('multiBarChart', multiBarChart)
  .directive('pieGraph', pieGraph)
  .directive('stackedAreaChart', stackedAreaChart).name;
