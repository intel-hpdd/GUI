// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import chartsModule from '../charts/charts-module';
import chartingModule from '../charting/charting-module';
import highlandModule from '../highland/highland-module';
import getOstBalanceChartFactory from './get-ost-balance-chart';

import type { HighlandStreamT } from 'highland';

export type getOstBalanceStreamT = (percentage: number, overrides: Object) => HighlandStreamT<mixed>;

export type ostBalancePayloadT = {
  percentage: number,
  page: string
};

export type ostBalancePayloadHashT = {
  [page: string]: ostBalancePayloadT
};

export type addOstBalanceActionT = {
  type: 'DEFAULT_OST_BALANCE_CHART_ITEMS' | 'UPDATE_OST_BALANCE_CHART_ITEMS',
  payload: ostBalancePayloadT
};

export default angular
  .module('ostBalance', [chartsModule, chartingModule, highlandModule])
  .factory('getOstBalanceChart', getOstBalanceChartFactory).name;
