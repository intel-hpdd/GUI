// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import flatMapChanges from "@iml/flat-map-changes";

import getCpuUsageStream from "./get-cpu-usage-stream.js";
import getStore from "../store/get-store.js";
import durationPayload from "../duration-picker/duration-payload.js";
import durationSubmitHandler from "../duration-picker/duration-submit-handler.js";
import chartCompiler from "../chart-compiler/chart-compiler.js";

import { getConf } from "../chart-transformers/chart-transformers.js";
import { UPDATE_CPU_USAGE_CHART_ITEMS, DEFAULT_CPU_USAGE_CHART_ITEMS } from "./cpu-usage-chart-reducer.js";
import type { $scopeT } from "angular";
import type { durationPayloadT } from "../duration-picker/duration-picker-module.js";
import type { localApplyT } from "../extend-scope-module.js";
import type { targetQueryT } from "../dashboard/dashboard-module.js";
import type { data$FnT } from "../chart-transformers/chart-transformers-module.js";

export default (localApply: localApplyT<*>, data$Fn: data$FnT) => {
  "ngInject";
  return function getCpuUsageChart(overrides: targetQueryT, page: string) {
    getStore.dispatch({
      type: DEFAULT_CPU_USAGE_CHART_ITEMS,
      payload: durationPayload({ page })
    });

    const config1$ = getStore.select("cpuUsageCharts");
    const initStream = config1$
      .through(getConf(page))
      .through(flatMapChanges.bind(null, data$Fn.bind(null, overrides, () => getCpuUsageStream)));

    return chartCompiler(
      `<div config-toggle>
  <h5>CPU Usage</h5>
  <div class="controls" ng-if="configToggle.inactive()">
    <button class="btn btn-xs btn-primary" ng-click="configToggle.setActive()">Configure <i class="fa fa-cog"></i></button>
    <a full-screen-btn class="btn btn-primary btn-xs"></a>
    <a class="drag btn btn-xs btn-default">Drag <i class="fa fa-arrows"></i></a>
  </div>
  <div class="configuration" ng-if="configToggle.active()">
    <div class="well well-lg">
      <form name="cpuUsageForm">
        <resettable-group>
          <duration-picker type="chart.configType" size="chart.size" unit="chart.unit" start-date="chart.startDate | toDate" end-date="chart.endDate | toDate"></duration-picker>
          <button type="submit" ng-click="::configToggle.setInactive(chart.onSubmit({}, cpuUsageForm))" class="btn btn-success btn-block" ng-disabled="cpuUsageForm.$invalid">Update</button>
          <button ng-click="::configToggle.setInactive()" class="btn btn-cancel btn-block" resetter>Cancel</button>
        </resettable-group>
      </form>
    </div>
  </div>
  <line-chart options="::chart.options" stream="chart.stream"></line-chart>
</div>`,
      initStream,
      ($scope: $scopeT, stream) => {
        const conf = {
          stream,
          configType: "",
          page: "",
          startDate: "",
          endDate: "",
          size: 1,
          unit: "",
          onSubmit: durationSubmitHandler(UPDATE_CPU_USAGE_CHART_ITEMS, {
            page
          }),
          options: {
            setup(d3Chart, d3) {
              d3Chart.useInteractiveGuideline(true);

              d3Chart.forceY([0, 1]);

              d3Chart.yAxis.tickFormat(d3.format(".1%"));

              d3Chart.xAxis.showMaxMin(false);

              d3Chart.color(["#2f7087", "#f09659", "#f0d359"]);
            }
          }
        };

        const config2$ = getStore.select("cpuUsageCharts");
        config2$.through(getConf(page)).each((x: durationPayloadT) => {
          Object.assign(conf, x);
          localApply($scope);
        });

        $scope.$on("$destroy", () => {
          stream.destroy();
          config1$.destroy();
          config2$.destroy();
        });

        return conf;
      }
    );
  };
};
