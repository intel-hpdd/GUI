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
import chartingModule from '../charting/charting-module';
import highlandModule from '../highland/highland-module';
import configToggleModule from '../config-toggle/config-toggle-module';
import socketModule from '../socket/socket-module';
import durationPickerModule from '../duration-picker/duration-picker-module';
import streamWhenVisibleModule from '../stream-when-visible/stream-when-visible-module';
import debounceModule from '../debounce/debounce-module';
import chartModule from '../charting/types/chart/chart-module';
import axisModule from '../charting/types/axis/axis-module';
import labelModule from '../charting/types/label/label-module';
import lineModule from '../charting/types/line/line-module';
import legendModule from '../charting/types/legend/legend-module';

// $FlowIgnore: HTML templates that flow does not recognize.
import agentVsCopytoolTemplate from './assets/html/agent-vs-copytool-chart';
import {getAgentVsCopytoolStreamFactory} from './agent-vs-copytool-stream';
import {getAgentVsCopytoolChartFactory} from './get-agent-vs-copytool-chart';

export default angular.module('agentVsCopytool', [
  chartingModule, highlandModule, configToggleModule,
  socketModule, durationPickerModule, streamWhenVisibleModule,
  debounceModule, chartModule, axisModule,
  labelModule, lineModule, legendModule, agentVsCopytoolTemplate
])
  .factory('getAgentVsCopytoolStream', getAgentVsCopytoolStreamFactory)
  .factory('getAgentVsCopytoolChart', getAgentVsCopytoolChartFactory)
  .name;
