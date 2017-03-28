// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';
import flatMapChanges from 'intel-flat-map-changes';
import chartCompiler from '../chart-compiler/chart-compiler.js';

import mdoTemplate from './assets/html/mdo.html!text';

import {
  DEFAULT_MDO_CHART_ITEMS,
  UPDATE_MDO_CHART_ITEMS
} from './mdo-chart-reducer.js';

import getMdoStream from './get-mdo-stream.js';
import formatNumber from '../number-formatters/format-number.js';
import getStore from '../store/get-store.js';
import durationPayload from '../duration-picker/duration-payload.js';
import durationSubmitHandler
  from '../duration-picker/duration-submit-handler.js';

import { getConf } from '../chart-transformers/chart-transformers.js';

import type {
  durationPayloadT
} from '../duration-picker/duration-picker-module.js';
import type { localApplyT } from '../extend-scope-module.js';
import type {
  filesystemQueryT,
  targetQueryT
} from '../dashboard/dashboard-module.js';
import type {
  data$FnT
} from '../chart-transformers/chart-transformers-module.js';

export default (localApply: localApplyT, data$Fn: data$FnT) => {
  'ngInject';
  return function getMdoChart(
    overrides: filesystemQueryT | targetQueryT,
    page: string
  ) {
    getStore.dispatch({
      type: DEFAULT_MDO_CHART_ITEMS,
      payload: durationPayload({ page })
    });

    const config1$ = getStore.select('mdoCharts');
    const initStream = config1$
      .through(getConf(page))
      .through(flatMapChanges(data$Fn(overrides, fp.always(getMdoStream))));

    return chartCompiler(mdoTemplate, initStream, ($scope, stream) => {
      const conf = {
        stream,
        configType: '',
        page: '',
        startDate: '',
        endDate: '',
        size: 1,
        unit: '',
        onSubmit: durationSubmitHandler(UPDATE_MDO_CHART_ITEMS, { page }),
        options: {
          setup(chart) {
            chart.useInteractiveGuideline(true);

            chart.interactiveLayer.tooltip.headerFormatter(fp.identity);

            chart.yAxis.tickFormat(d => formatNumber(d, 2, true));

            chart.forceY([0, 1]);

            chart.xAxis.showMaxMin(false);
          }
        }
      };

      const config2$ = getStore.select('mdoCharts');
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
    });
  };
};
