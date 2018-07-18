// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';
import flatMapChanges from '@iml/flat-map-changes';
import chartCompiler from '../chart-compiler/chart-compiler.js';

import { DEFAULT_MDO_CHART_ITEMS, UPDATE_MDO_CHART_ITEMS } from './mdo-chart-reducer.js';

import getMdoStream from './get-mdo-stream.js';
import { formatNumber } from '@iml/number-formatters';
import getStore from '../store/get-store.js';
import durationPayload from '../duration-picker/duration-payload.js';
import durationSubmitHandler from '../duration-picker/duration-submit-handler.js';

import { getConf } from '../chart-transformers/chart-transformers.js';

import type { durationPayloadT } from '../duration-picker/duration-picker-module.js';
import type { localApplyT } from '../extend-scope-module.js';
import type { filesystemQueryT, targetQueryT } from '../dashboard/dashboard-module.js';
import type { data$FnT } from '../chart-transformers/chart-transformers-module.js';

export default (localApply: localApplyT<*>, data$Fn: data$FnT) => {
  'ngInject';
  return function getMdoChart(overrides: filesystemQueryT | targetQueryT, page: string) {
    getStore.dispatch({
      type: DEFAULT_MDO_CHART_ITEMS,
      payload: durationPayload({ page })
    });

    const config1$ = getStore.select('mdoCharts');
    const initStream = config1$
      .through(getConf(page))
      .through(flatMapChanges.bind(null, data$Fn.bind(null, overrides, () => getMdoStream)));

    return chartCompiler(
      `<div config-toggle>
  <h5>Metadata Operations</h5>
  <div class="controls" ng-if="configToggle.inactive()">
    <button class="btn btn-xs btn-primary" ng-click="configToggle.setActive()">Configure <i class="fa fa-cog"></i></button>
    <a full-screen-btn class="btn btn-primary btn-xs"></a>
    <a class="drag btn btn-xs btn-default">Drag <i class="fa fa-arrows"></i></a>
  </div>
  <div class="configuration" ng-if="configToggle.active()">
    <div class="well well-lg">
      <form name="mdoForm">
        <resettable-group>
          <duration-picker type="chart.configType" size="chart.size" unit="chart.unit" start-date="chart.startDate | toDate" end-date="chart.endDate | toDate"></duration-picker>
          <button type="submit" ng-click="::configToggle.setInactive(chart.onSubmit({}, mdoForm))" class="btn btn-success btn-block" ng-disabled="mdoForm.$invalid">Update</button>
          <button ng-click="::configToggle.setInactive()" class="btn btn-cancel btn-block" resetter>Cancel</button>
        </resettable-group>
      </form>
    </div>
  </div>
  <stacked-area-chart options="::chart.options" stream="chart.stream"></stacked-area-chart>
</div>`,
      initStream,
      ($scope, stream) => {
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
      }
    );
  };
};
