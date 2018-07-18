// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import chartsModule from '../charts/charts-module';
import chartingModule from '../charting/charting-module';
import highlandModule from '../highland/highland-module';
import configToggleModule from '../config-toggle/config-toggle-module';
import durationPickerModule from '../duration-picker/duration-picker-module';
import streamWhenVisibleModule from '../stream-when-visible/stream-when-visible-module';
import getMemoryUsageChartFactory from './get-memory-usage-chart';

import type { durationPayloadT } from '../duration-picker/duration-picker-module.js';

export type addMemoryUsageActionT = {
  type: 'UPDATE_MEMORY_USAGE_CHART_ITEMS' | 'DEFAULT_MEMORY_USAGE_CHART_ITEMS',
  payload: durationPayloadT
};

export default angular
  .module('memoryUsageModule', [
    chartsModule,
    chartingModule,
    highlandModule,
    configToggleModule,
    durationPickerModule,
    streamWhenVisibleModule
  ])
  .factory('getMemoryUsageChart', getMemoryUsageChartFactory).name;
