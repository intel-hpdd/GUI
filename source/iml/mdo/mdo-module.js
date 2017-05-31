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
import getMdoChartFactory from './get-mdo-chart';

import type {
  durationPayloadT
} from '../duration-picker/duration-picker-module.js';

import type {
  HighlandStreamT
} from 'highland';

export type getMdoStreamT = (requestRange:(overrides:Object) => Object,
  buff:(s:HighlandStreamT<mixed>) => HighlandStreamT<mixed>) => HighlandStreamT<mixed>;
export type addMdoActionT = {
    type:'DEFAULT_MDO_CHART_ITEMS' | 'UPDATE_MDO_CHART_ITEMS',
    payload:durationPayloadT
}


export default angular.module('mdo', [
  chartsModule, chartingModule, highlandModule,
  durationPickerModule
])
  .factory('getMdoChart', getMdoChartFactory)
  .name;
