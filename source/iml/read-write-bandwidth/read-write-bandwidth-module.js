// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import chartsModule from '../charts/charts-module';
import chartingModule from '../charting/charting-module';
import highlandModule from '../highland/highland-module';
import durationPickerModule from '../duration-picker/duration-picker-module';

import getReadWriteBandwidthChartFactory from './get-read-write-bandwidth-chart';

import type { durationPayloadT } from '../duration-picker/duration-picker-module.js';

export type readWriteBandwidthActionT = {
  type: 'DEFAULT_READ_WRITE_BANDWIDTH_CHART_ITEMS' | 'UPDATE_READ_WRITE_BANDWIDTH_CHART_ITEMS',
  payload: durationPayloadT
};

export default angular
  .module('readWriteBandwidth', [chartsModule, chartingModule, highlandModule, durationPickerModule])
  .factory('getReadWriteBandwidthChart', getReadWriteBandwidthChartFactory).name;
