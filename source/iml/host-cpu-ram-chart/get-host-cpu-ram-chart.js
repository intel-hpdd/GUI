// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import flatMapChanges from '@iml/flat-map-changes';

import getHostCpuRamStream from './get-host-cpu-ram-stream.js';
import durationPayload from '../duration-picker/duration-payload.js';
import durationSubmitHandler from '../duration-picker/duration-submit-handler.js';
import chartCompiler from '../chart-compiler/chart-compiler.js';
import getStore from '../store/get-store.js';

import { UPDATE_HOST_CPU_RAM_CHART_ITEMS, DEFAULT_HOST_CPU_RAM_CHART_ITEMS } from './host-cpu-ram-chart-reducer.js';
import { getConf } from '../chart-transformers/chart-transformers.js';

import { hasChanges } from '../tree/tree-transforms.js';

import type { $scopeT } from 'angular';

import type { data$FnT } from '../chart-transformers/chart-transformers-module.js';

import type { HighlandStreamT } from 'highland';

import type { durationPickerConfigT, durationPayloadT } from '../duration-picker/duration-picker-module.js';

import type { localApplyT } from '../extend-scope-module.js';

import type { filesystemQueryT, targetQueryT } from '../dashboard/dashboard-module.js';

export default (data$Fn: data$FnT, localApply: localApplyT<*>) => {
  'ngInject';
  return function getHostCpuRamChart(title: string, overrides: filesystemQueryT | targetQueryT, page: string) {
    getStore.dispatch({
      type: DEFAULT_HOST_CPU_RAM_CHART_ITEMS,
      payload: durationPayload({ page })
    });

    const config1$ = getStore.select('hostCpuRamCharts');
    const initStream = config1$
      .through(getConf(page))
      .filter(hasChanges(x => x))
      .through(flatMapChanges.bind(null, data$Fn.bind(null, overrides, () => getHostCpuRamStream)));

    return chartCompiler(
      `<div config-toggle>
  <h5>{{ chart.title }}</h5>
  <div class="controls" ng-if="configToggle.inactive()">
    <button class="btn btn-xs btn-primary" ng-click="configToggle.setActive()">Configure <i class="fa fa-cog"></i></button>
    <a full-screen-btn class="btn btn-primary btn-xs"></a>
    <a class="drag btn btn-xs btn-default">Drag <i class="fa fa-arrows"></i></a>
  </div>
  <div class="configuration" ng-if="configToggle.active()">
    <div class="well well-lg">
      <form name="hostCpuRamForm">
        <resettable-group>
          <duration-picker type="chart.configType" size="chart.size" unit="chart.unit" start-date="chart.startDate | toDate" end-date="chart.endDate | toDate"></duration-picker>
          <button type="submit" ng-click="::configToggle.setInactive(chart.onSubmit({}, hostCpuRamForm))" class="btn btn-success btn-block" ng-disabled="hostCpuRamForm.$invalid">Update</button>
          <button ng-click="::configToggle.setInactive()" class="btn btn-cancel btn-block" resetter>Cancel</button>
        </resettable-group>
      </form>
    </div>
  </div>
  <line-chart options="::chart.options" stream="::chart.stream"></line-chart>
</div>`,
      initStream,
      ($scope: $scopeT, stream: HighlandStreamT<durationPickerConfigT>) => {
        const conf = {
          title,
          stream,
          configType: '',
          page: '',
          startDate: '',
          endDate: '',
          size: 1,
          unit: '',
          onSubmit: durationSubmitHandler(UPDATE_HOST_CPU_RAM_CHART_ITEMS, {
            page
          }),
          options: {
            setup: function setup(d3Chart, d3) {
              d3Chart.useInteractiveGuideline(true);

              d3Chart.forceY([0, 1]);

              d3Chart.yAxis.tickFormat(d3.format('.1%'));

              d3Chart.color(['#F3B600', '#0067B4']);
            }
          }
        };

        const config2$ = getStore.select('hostCpuRamCharts');
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
