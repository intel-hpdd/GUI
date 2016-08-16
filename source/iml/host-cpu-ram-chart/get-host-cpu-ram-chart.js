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

// @flow

import flatMapChanges from 'intel-flat-map-changes';

// $FlowIgnore: HTML templates that flow does not recognize.
import hostCpuRamChartTemplate from './assets/html/host-cpu-ram-chart.html!text';
import getHostCpuRamStream from './get-host-cpu-ram-stream.js';
import durationPayload from '../duration-picker/duration-payload.js';
import durationSubmitHandler from '../duration-picker/duration-submit-handler.js';
import chartCompiler from '../chart-compiler/chart-compiler.js';
import getStore from '../store/get-store.js';

import {
  always
} from 'intel-fp';
import {
  UPDATE_HOST_CPU_RAM_CHART_ITEMS,
  DEFAULT_HOST_CPU_RAM_CHART_ITEMS
} from './host-cpu-ram-chart-reducer.js';
import {
  getConf
} from '../chart-transformers/chart-transformers.js';

import {
  hasChanges
} from '../tree/tree-transforms.js';

import type {
  data$FnT
} from '../chart-transformers/chart-transformers-module.js';
import type {
  HighlandStreamT
} from 'highland';
import type {
  durationPickerConfigT,
  durationPayloadT
} from '../duration-picker/duration-picker-module.js';
import type {
  localApplyT
} from '../extend-scope-module.js';
import type {
  filesystemQueryT,
  targetQueryT
} from '../dashboard/dashboard-module.js';

export default (data$Fn:data$FnT, localApply:localApplyT) => {
  'ngInject';

  return function getHostCpuRamChart (title:string, overrides:filesystemQueryT | targetQueryT, page:string) {

    getStore.dispatch({
      type: DEFAULT_HOST_CPU_RAM_CHART_ITEMS,
      payload: durationPayload({page})
    });

    const config1$ = getStore.select('hostCpuRamCharts');
    const initStream = config1$
      .through(getConf(page))
      .filter(hasChanges(x => x))
      .through(
        flatMapChanges(
          data$Fn(overrides, always(getHostCpuRamStream))
        )
      );

    return chartCompiler(hostCpuRamChartTemplate, initStream,
    ($scope:$scope, stream:HighlandStreamT<durationPickerConfigT>) => {

      const conf = {
        title,
        stream,
        configType: '',
        page: '',
        startDate: '',
        endDate: '',
        size: 1,
        unit:'',
        onSubmit: durationSubmitHandler(UPDATE_HOST_CPU_RAM_CHART_ITEMS, {page}),
        options: {
          setup: function setup (d3Chart, d3) {
            d3Chart.useInteractiveGuideline(true);

            d3Chart.forceY([0, 1]);

            d3Chart.yAxis.tickFormat(d3.format('.1%'));

            d3Chart.color(['#F3B600', '#0067B4']);
          }
        }
      };

      const config2$ = getStore.select('hostCpuRamCharts');
      config2$
        .through(getConf(page))
        .each((x:durationPayloadT) => {
          Object.assign(conf, x);
          localApply($scope);
        });

      $scope.$on('$destroy', () => {
        stream.destroy();
        config1$.destroy();
        config2$.destroy();
      });

      return conf;
    });
  };
};
