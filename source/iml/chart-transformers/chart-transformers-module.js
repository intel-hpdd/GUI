// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import {
  data$Fn,
  getConf
} from './chart-transformers.js';

import type {
  HighlandStreamT
} from 'highland';

import type {
  Curry3
} from 'intel-fp';

import type {
  durationPayloadT
} from '../duration-picker/duration-picker-module.js';

import type {
  heatMapDurationPayloadT
} from '../read-write-heat-map/read-write-heat-map-module.js';

import type {
  ostBalancePayloadT
} from '../ost-balance/ost-balance-module.js';

import type {
  filesystemQueryT,
  targetQueryT
} from '../dashboard/dashboard-module.js';

type confTypes = durationPayloadT | heatMapDurationPayloadT | ostBalancePayloadT;
export type configToStreamT = (x:durationPayloadT) => (a:any, b:any) => HighlandStreamT<any>;
export type heatMapConfigToStreamT = (x:heatMapDurationPayloadT) => (a:any, b:any) => HighlandStreamT<any>;
export type getConfT = (page:string) => HighlandStreamT<confTypes>;
export type data$FnT = Curry3<
  filesystemQueryT | targetQueryT,
  configToStreamT | heatMapConfigToStreamT,
  mixed,
  HighlandStreamT<mixed>
>;
export default angular.module('chartTransformers', [])
  .factory('data$Fn', data$Fn)
  .value('getConf', getConf)
  .name;
