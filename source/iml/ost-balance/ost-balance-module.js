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
import chartsModule from '../charts/charts-module';
import chartingModule from '../charting/charting-module';
import highlandModule from '../highland/highland-module';
import getOstBalanceChartFactory from './get-ost-balance-chart';

import type {
  HighlandStreamT
} from 'highland';

export type getOstBalanceStreamT = (percentage:number, overrides:Object) => HighlandStreamT<mixed>;

export type ostBalancePayloadT = {
  percentage:number,
  page:string
};

export type ostBalancePayloadHashT = {
  [page:string]:ostBalancePayloadT
};

export type addOstBalanceActionT = {
    type:'DEFAULT_OST_BALANCE_CHART_ITEMS' | 'UPDATE_OST_BALANCE_CHART_ITEMS',
    payload:ostBalancePayloadT
};

export default angular.module('ostBalance',[
  chartsModule, chartingModule, highlandModule
])
  .factory('getOstBalanceChart', getOstBalanceChartFactory)
  .name;
