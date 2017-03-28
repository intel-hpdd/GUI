// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import flatMapChanges from 'intel-flat-map-changes';
import * as fp from 'intel-fp';
import getReadWriteBandwidthStream from './get-read-write-bandwidth-stream.js';
import formatBytes from '../number-formatters/format-bytes.js';
import durationPayload from '../duration-picker/duration-payload.js';
import durationSubmitHandler
  from '../duration-picker/duration-submit-handler.js';
import getStore from '../store/get-store.js';
import chartCompiler from '../chart-compiler/chart-compiler.js';

import {
  DEFAULT_READ_WRITE_BANDWIDTH_CHART_ITEMS,
  UPDATE_READ_WRITE_BANDWIDTH_CHART_ITEMS
} from './read-write-bandwidth-chart-reducer.js';
import { getConf } from '../chart-transformers/chart-transformers.js';

import readWriteBandwidthTemplate
  from './assets/html/read-write-bandwidth.html!text';

import type {
  data$FnT
} from '../chart-transformers/chart-transformers-module.js';
import type { HighlandStreamT } from 'highland';
import type {
  durationPickerConfigT,
  durationPayloadT
} from '../duration-picker/duration-picker-module.js';
import type { localApplyT } from '../extend-scope-module.js';
import type {
  filesystemQueryT,
  targetQueryT
} from '../dashboard/dashboard-module.js';

export default (data$Fn: data$FnT, localApply: localApplyT) => {
  'ngInject';
  return function getReadWriteBandwidthChart(
    overrides: filesystemQueryT | targetQueryT,
    page: string
  ) {
    getStore.dispatch({
      type: DEFAULT_READ_WRITE_BANDWIDTH_CHART_ITEMS,
      payload: durationPayload({ page })
    });

    const config1$ = getStore.select('readWriteBandwidthCharts');
    const initStream = config1$
      .through(getConf(page))
      .through(
        flatMapChanges(
          data$Fn(overrides, fp.always(getReadWriteBandwidthStream))
        )
      );

    return chartCompiler(
      readWriteBandwidthTemplate,
      initStream,
      ($scope, stream: HighlandStreamT<durationPickerConfigT>) => {
        const conf = {
          stream,
          configType: '',
          page: '',
          startDate: '',
          endDate: '',
          size: 1,
          unit: '',
          onSubmit: durationSubmitHandler(
            UPDATE_READ_WRITE_BANDWIDTH_CHART_ITEMS,
            { page }
          ),
          options: {
            setup: function setup(d3Chart) {
              d3Chart.useInteractiveGuideline(true);

              d3Chart.yAxis.tickFormat(function(number) {
                if (number === 0) return number;

                return formatBytes(Math.abs(number), 3) + '/s';
              });

              d3Chart.color(['#0067B4', '#E17200']);

              d3Chart.isArea(true);

              d3Chart.xAxis.showMaxMin(false);
            }
          }
        };

        const config2$ = getStore.select('readWriteBandwidthCharts');
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
