//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

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
