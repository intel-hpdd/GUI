// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import d3Module from '../d3/d3-module';
import nvModule from '../nv/nv-module';
import heatMapModule from '../heat-map/heat-map-module';
import streamWhenVisibleModule from '../stream-when-visible/stream-when-visible-module';
import uiBootstrapModule from 'angular-ui-bootstrap';
import baseChart from './base-chart';
import dateTicksFactory from './date-ticks';
import heatMap from './heat-map-chart';
import lineChart from './line-chart';
import multiBarChart from './multi-bar-chart';
import pieGraph from './pie-graph';
import stackedAreaChart from './stacked-area-chart';

export default angular.module('charts',
  [
    d3Module, nvModule,
    uiBootstrapModule, heatMapModule,
    streamWhenVisibleModule
  ])
  .value('baseChart', baseChart)
  .factory('dateTicks', dateTicksFactory)
  .directive('heatMap', heatMap)
  .directive('lineChart', lineChart)
  .directive('multiBarChart', multiBarChart)
  .directive('pieGraph', pieGraph)
  .directive('stackedAreaChart', stackedAreaChart)
  .name;
