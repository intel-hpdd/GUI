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
import socketModule from '../socket/socket-module';
import durationPickerModule from '../duration-picker/duration-picker-module';
import {getMdoStreamFactory} from './get-mdo-stream';
import {getMdoChartFactory} from './get-mdo-chart';

// $FlowIgnore: HTML templates that flow does not recognize.
import mdoChartTemplate from './assets/html/mdo';

import type {
  HighlandStreamT
} from 'highland';
import type {
  scopeToElementT
} from '../chart-compiler/chart-compiler-module.js';

export type getMdoStreamT = (requestRange:(overrides:Object) => Object,
  buff:(s:HighlandStreamT<mixed>) => HighlandStreamT<mixed>) => HighlandStreamT<mixed>;
export type getMdoChartT = (chartStore:'mdoChart' | 'mdoTargetChart', overrides:Object) => Promise<scopeToElementT>;

export default angular.module('mdo', [
  chartsModule, chartingModule, highlandModule,
  socketModule, durationPickerModule, mdoChartTemplate
])
  .factory('getMdoStream', getMdoStreamFactory)
  .factory('getMdoChart', getMdoChartFactory)
  .name;
