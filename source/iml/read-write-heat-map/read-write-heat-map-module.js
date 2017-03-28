// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import chartsModule from '../charts/charts-module';
import chartingModule from '../charting/charting-module';
import highlandModule from '../highland/highland-module';
import durationPickerModule from '../duration-picker/duration-picker-module';
import getReadWriteHeatMapChartFactory from './get-read-write-heat-map-chart';

export type readWriteHeatMapTypesT = {
  READ_BYTES: 'stats_read_bytes',
  WRITE_BYTES: 'stats_write_bytes',
  READ_IOPS: 'stats_read_iops',
  WRITE_IOPS: 'stats_write_iops'
};

import type {
  durationPayloadT,
  durationConfigT,
  rangeConfigT
} from '../duration-picker/duration-picker-module.js';

import type { scopeToElementT } from '../dashboard/dashboard-types.js';

export type heatMapConfigT =
  | (rangeConfigT & { dataType: string })
  | (durationConfigT & { dataType: string });
export type heatMapDurationPayloadT = durationPayloadT & { dataType: string };
export type getReadWriteHeatMapChartT = (
  overrides: Object
) => Promise<scopeToElementT>;

export type heatMapPayloadHashT = {
  [page: string]: heatMapDurationPayloadT
};

export type addReadWriteHeatMapActionT = {
  type:
    | 'DEFAULT_READ_WRITE_HEAT_MAP_CHART_ITEMS'
    | 'UPDATE_READ_WRITE_HEAT_MAP_CHART_ITEMS',
  payload: heatMapDurationPayloadT
};

export default angular
  .module('readWriteHeatMap', [
    chartsModule,
    chartingModule,
    highlandModule,
    durationPickerModule
  ])
  .constant('readWriteHeatMapTypes', {
    READ_BYTES: 'stats_read_bytes',
    WRITE_BYTES: 'stats_write_bytes',
    READ_IOPS: 'stats_read_iops',
    WRITE_IOPS: 'stats_write_iops'
  })
  .factory('getReadWriteHeatMapChart', getReadWriteHeatMapChartFactory).name;
