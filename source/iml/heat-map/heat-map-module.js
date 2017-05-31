// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import d3Module from '../d3/d3-module';
import nvModule from '../nv/nv-module';
import getHeatMapChartFactory from './get-heat-map-chart';
import getHeatMapLegendFactory from './get-heat-map-legend';
import getHeatMapFactory from './get-heat-map';

export default angular
  .module('heatMap', [d3Module, nvModule])
  .factory('getHeatMapChart', getHeatMapChartFactory)
  .factory('getHeatMapLegend', getHeatMapLegendFactory)
  .factory('getHeatMap', getHeatMapFactory)
  .name;
