// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';
import flatMapChanges from 'intel-flat-map-changes';

import memoryUsageChartTemplate
  from './assets/html/memory-usage-chart.html!text';
import getMemoryUsageStream from './get-memory-usage-stream.js';
import formatBytes from '../number-formatters/format-bytes.js';
import getStore from '../store/get-store.js';
import durationPayload from '../duration-picker/duration-payload.js';
import durationSubmitHandler
  from '../duration-picker/duration-submit-handler.js';
import chartCompiler from '../chart-compiler/chart-compiler.js';

import { getConf } from '../chart-transformers/chart-transformers.js';
import {
  UPDATE_MEMORY_USAGE_CHART_ITEMS,
  DEFAULT_MEMORY_USAGE_CHART_ITEMS
} from './memory-usage-chart-reducer.js';

import type { $scopeT } from 'angular';
import type {
  durationPayloadT
} from '../duration-picker/duration-picker-module.js';
import type { localApplyT } from '../extend-scope-module.js';
import type { targetQueryT } from '../dashboard/dashboard-module.js';
import type {
  data$FnT
} from '../chart-transformers/chart-transformers-module.js';

export default (localApply: localApplyT, data$Fn: data$FnT) => {
  'ngInject';
  return function getMemoryUsageChart(overrides: targetQueryT, page: string) {
    getStore.dispatch({
      type: DEFAULT_MEMORY_USAGE_CHART_ITEMS,
      payload: durationPayload({ page })
    });

    const config1$ = getStore.select('memoryUsageCharts');
    const initStream = config1$
      .through(getConf(page))
      .through(
        flatMapChanges(data$Fn(overrides, fp.always(getMemoryUsageStream)))
      );

    return chartCompiler(
      memoryUsageChartTemplate,
      initStream,
      ($scope: $scopeT, stream) => {
        const conf = {
          stream,
          configType: '',
          page: '',
          startDate: '',
          endDate: '',
          size: 1,
          unit: '',
          onSubmit: durationSubmitHandler(UPDATE_MEMORY_USAGE_CHART_ITEMS, {
            page
          }),
          options: {
            setup: function setup(d3Chart) {
              d3Chart.useInteractiveGuideline(true);

              d3Chart.yAxis.tickFormat(function formatNumber(number) {
                if (number === 0) return number;

                return formatBytes(number, 4);
              });

              d3Chart.xAxis.showMaxMin(false);
            }
          }
        };

        const config2$ = getStore.select('memoryUsageCharts');
        config2$.through(getConf(page)).each((x: durationPayloadT) => {
          Object.assign(conf, x);
          localApply($scope);
        });

        $scope.$on('$destroy', () => {
          stream.destroy();
          config1$.destroy();
          config2$.destroy();
        });

        return conf;
      }
    );
  };
};
