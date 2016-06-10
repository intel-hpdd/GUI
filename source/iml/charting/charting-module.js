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
import createDateModule from '../create-date/create-date-module';
import serverMomentModule from '../server-moment-module';
import highlandModule from '../highland/highland-module';
import d3Module from '../d3/d3-module';
import getTemplatePromiseModule from '../get-template-promise/get-template-promise-module';
import socketModule from '../socket/socket-module';
import chartCompilerModule from '../chart-compiler/chart-compiler-module';
import bufferDataNewerThan from './buffer-data-newer-than';
import chartPlugins from './chart-plugins';
import {createStream} from './create-stream';
import {getRequestRange, getRequestDuration, getTimeParams} from './get-time-params';
import nameSeries from './name-series';
import objToPointsFactory from './obj-to-points';
import removeDupsBy from './remove-dups-by';
import removeDups from './remove-dups';
import removeEpochData from './remove-epoch-data';
import roundData from './round-data';
import sortByDateFactory from './sort-by-date';
import sortBy from './sort-by';
import sumByDate from './sum-by-date';
import toNvd3 from './to-nvd3';
import unionWithTargetFactory from './union-with-target';

import type {
  HighlandStreamT
} from 'highland';
export type bufferDataNewerThanT = (size:number, unit:string) =>
  (s:HighlandStreamT<mixed>) => HighlandStreamT<mixed>;
export type sortByDateT = (stream:HighlandStreamT<mixed>) => HighlandStreamT<mixed>;
export type createStreamT = {
  durationStream: Function,
  rangeStream: Function
};


export default angular.module('charting', [
  createDateModule, serverMomentModule,
  highlandModule, d3Module, getTemplatePromiseModule,
  socketModule, chartCompilerModule
])
  .factory('bufferDataNewerThan', bufferDataNewerThan)
  .factory('chartPlugins', chartPlugins)
  .factory('createStream', createStream)
  .factory('getRequestRange', getRequestRange)
  .factory('getRequestDuration', getRequestDuration)
  .factory('getTimeParams', getTimeParams)
  .value('nameSeries', nameSeries)
  .factory('objToPoints', objToPointsFactory)
  .value('removeDupsBy', removeDupsBy)
  .value('removeDups', removeDups)
  .value('removeEpochData', removeEpochData)
  .value('roundData', roundData)
  .factory('sortByDate', sortByDateFactory)
  .value('sortBy', sortBy)
  .factory('sumByDate', sumByDate)
  .value('toNvd3', toNvd3)
  .factory('unionWithTarget', unionWithTargetFactory)
  .name;
