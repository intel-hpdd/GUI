// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import chartingModule from '../charting/charting-module';
import highlandModule from '../highland/highland-module';
import configToggleModule from '../config-toggle/config-toggle-module';
import durationPickerModule from '../duration-picker/duration-picker-module';
import streamWhenVisibleModule from '../stream-when-visible/stream-when-visible-module';
import chartModule from '../charting/types/chart/chart-module';
import axisModule from '../charting/types/axis/axis-module';
import labelModule from '../charting/types/label/label-module';
import lineModule from '../charting/types/line/line-module';
import legendModule from '../charting/types/legend/legend-module';
import getAgentVsCopytoolChartFactory from './get-agent-vs-copytool-chart';

import type { durationPayloadT } from '../duration-picker/duration-picker-module.js';

export type addAgentVsCopytoolActionT = {
  type: 'UPDATE_AGENT_VS_COPYTOOL_CHART_ITEMS' | 'DEFAULT_AGENT_VS_COPYTOOL_CHART_ITEMS',
  payload: durationPayloadT
};

export default angular
  .module('agentVsCopytool', [
    chartingModule,
    highlandModule,
    configToggleModule,
    durationPickerModule,
    streamWhenVisibleModule,
    chartModule,
    axisModule,
    labelModule,
    lineModule,
    legendModule
  ])
  .factory('getAgentVsCopytoolChart', getAgentVsCopytoolChartFactory).name;
