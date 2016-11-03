//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';
import flatMapChanges from 'intel-flat-map-changes';

import spaceUsageTemplate from './assets/html/space-usage-chart.html!text';
import getSpaceUsageStream from './get-space-usage-stream.js';
import getStore from '../store/get-store.js';
import durationPayload from '../duration-picker/duration-payload.js';
import durationSubmitHandler from '../duration-picker/duration-submit-handler.js';
import chartCompiler from '../chart-compiler/chart-compiler.js';

import {
  getConf
} from '../chart-transformers/chart-transformers.js';
import {
  DEFAULT_SPACE_USAGE_CHART_ITEMS,
  UPDATE_SPACE_USAGE_CHART_ITEMS
} from './space-usage-chart-reducer.js';

import type {
  durationPayloadT
} from '../duration-picker/duration-picker-module.js';
import type {
  localApplyT
} from '../extend-scope-module.js';
import type {
  targetQueryT
} from '../dashboard/dashboard-module.js';
import type {
  data$FnT
} from '../chart-transformers/chart-transformers-module.js';

export default (localApply:localApplyT, data$Fn:data$FnT) => {
  'ngInject';

  return function getSpaceUsageChart (overrides:targetQueryT, page:string) {
    getStore.dispatch({
      type: DEFAULT_SPACE_USAGE_CHART_ITEMS,
      payload: durationPayload({page})
    });

    const config1$ = getStore.select('spaceUsageCharts');
    const initStream = config1$
      .through(getConf(page))
      .through(
        flatMapChanges(
          data$Fn(overrides, fp.always(getSpaceUsageStream))
        )
      );

    return chartCompiler(spaceUsageTemplate, initStream, ($scope:$scopeT, stream) => {
      const conf = {
        stream,
        configType: '',
        page: '',
        startDate: '',
        endDate: '',
        size: 1,
        unit:'',
        onSubmit: durationSubmitHandler(UPDATE_SPACE_USAGE_CHART_ITEMS, {page}),
        options: {
          setup (d3Chart, d3) {
            d3Chart.useInteractiveGuideline(true);

            d3Chart.forceY([0, 1]);

            d3Chart.yAxis.tickFormat(d3.format('.1%'));

            d3Chart.xAxis.showMaxMin(false);

            d3Chart.color(['#f05b59']);

            d3Chart.isArea(true);
          }
        }
      };

      const config2$ = getStore.select('spaceUsageCharts');
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
