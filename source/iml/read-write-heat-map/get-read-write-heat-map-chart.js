// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import flatMapChanges from "@iml/flat-map-changes";
import getReadWriteHeatMapStream from "./get-read-write-heat-map-stream.js";
import { formatNumber, formatBytes } from "@iml/number-formatters";
import durationPayload from "../duration-picker/duration-payload.js";
import getStore from "../store/get-store.js";
import durationSubmitHandler from "../duration-picker/duration-submit-handler.js";
import chartCompiler from "../chart-compiler/chart-compiler.js";

import { values } from "@iml/obj";

import { getConf } from "../chart-transformers/chart-transformers.js";

import {
  DEFAULT_READ_WRITE_HEAT_MAP_CHART_ITEMS,
  UPDATE_READ_WRITE_HEAT_MAP_CHART_ITEMS
} from "../read-write-heat-map/read-write-heat-map-chart-reducer.js";

import { SERVER_TIME_DIFF } from "../environment.js";

import type { $scopeT } from "angular";

import type { localApplyT } from "../extend-scope-module.js";

import type { readWriteHeatMapTypesT, heatMapDurationPayloadT } from "./read-write-heat-map-module.js";

import type { filesystemQueryT, targetQueryT } from "../dashboard/dashboard-module.js";

import type { HighlandStreamT } from "highland";

import type { StateServiceT } from "angular-ui-router";

import type { streamWhenChartVisibleT } from "../stream-when-visible/stream-when-visible-module.js";

export default (
  $state: StateServiceT,
  localApply: localApplyT<*>,
  readWriteHeatMapTypes: readWriteHeatMapTypesT,
  streamWhenVisible: streamWhenChartVisibleT
) => {
  "ngInject";
  const dataLens = fp.view(fp.lensProp("data"));
  const maxMillisecondsDiff = 30000;

  return function getReadWriteHeatMapChart(overrides: filesystemQueryT | targetQueryT, page: string) {
    getStore.dispatch({
      type: DEFAULT_READ_WRITE_HEAT_MAP_CHART_ITEMS,
      payload: durationPayload({
        dataType: "stats_read_bytes",
        page
      })
    });

    const config1$ = getStore.select("readWriteHeatMapCharts");

    const initStream = config1$.through(getConf(page)).through(
      flatMapChanges.bind(null, (x: heatMapDurationPayloadT) =>
        streamWhenVisible(() =>
          getReadWriteHeatMapStream(
            {
              ...overrides,
              qs: { ...overrides.qs, metrics: x.dataType }
            },
            x.configType === "duration" ? x : undefined,
            x.configType === "range" ? x : undefined,
            SERVER_TIME_DIFF
          )
        )
      )
    );

    return chartCompiler(
      `<div class="read-write-heat-map" config-toggle>
  <h5>Read/Write Heat Map</h5>
  <div class="controls" ng-if="configToggle.inactive()">
    <button class="btn btn-xs btn-primary" ng-click="configToggle.setActive()">Configure <i class="fa fa-cog"></i></button>
    <a full-screen-btn class="btn btn-primary btn-xs"></a>
    <a class="drag btn btn-xs btn-default">Drag <i class="fa fa-arrows"></i></a>
  </div>
  <div class="configuration" ng-if="configToggle.active()">
    <div class="well well-lg">
      <form name="readWriteHeatMapForm">
        <resettable-group>
          <duration-picker type="chart.configType" size="chart.size" unit="chart.unit" start-date="chart.startDate | toDate" end-date="chart.endDate | toDate"></duration-picker>
          <div class="form-group" >
            <label class="control-label">Select data to view</label>
            <select name="type" class="form-control" ng-model="chart.dataType"
                    ng-options="value as chart.toReadableType(value) for value in chart.TYPES"></select>
          </div>
          <button type="submit" ng-click="::configToggle.setInactive(chart.onSubmit({dataType: chart.dataType}, readWriteHeatMapForm))" class="btn btn-success btn-block" ng-disabled="readWriteHeatMapForm.$invalid">Update</button>
          <button ng-click="::configToggle.setInactive()" class="btn btn-cancel btn-block" resetter>Cancel</button>
        </resettable-group>
      </form>
    </div>
  </div>
  <heat-map options="::chart.options" stream="::chart.stream"></heat-map>
</div>`,
      initStream,
      ($scope: $scopeT, stream: HighlandStreamT<Object[]>) => {
        const conf = {
          stream,
          TYPES: values(readWriteHeatMapTypes),
          configType: "",
          page: "",
          dataType: "",
          startDate: "",
          endDate: "",
          size: 1,
          unit: "",
          toReadableType(type) {
            const readable = type
              .split("_")
              .splice(1)
              .join(" ")
              .replace("bytes", "Byte/s")
              .replace("iops", "IOPS");

            return readable.charAt(0).toUpperCase() + readable.slice(1);
          },
          onSubmit: durationSubmitHandler(UPDATE_READ_WRITE_HEAT_MAP_CHART_ITEMS, { page }),
          options: {
            setup(d3Chart) {
              d3Chart.margin({
                left: 70,
                bottom: 50,
                right: 50
              });

              d3Chart.dispatch.on("click", function onClick(points) {
                let sDate = new Date(points.current.ts);
                const eDate = points.next ? new Date(points.next.ts) : new Date();
                const dateDiff = eDate.getTime() - sDate.getTime();

                if (dateDiff < maxMillisecondsDiff) {
                  const millisecondsToAdd = maxMillisecondsDiff - dateDiff;
                  sDate = new Date(sDate.valueOf() - millisecondsToAdd);
                }

                const startDate = sDate.toISOString();
                const endDate = eDate.toISOString();

                $scope.$apply(function applyLocationChange() {
                  $state.go("app.jobstats", {
                    id: points.current.id,
                    startDate,
                    endDate
                  });
                });
              });
              d3Chart.formatter(getFormatter(conf.dataType));
              d3Chart.zValue(
                fp.flow(
                  dataLens,
                  fp.view(fp.lensProp(conf.dataType))
                )
              );

              d3Chart.xAxis().ticks(3);
            },
            beforeUpdate: function beforeUpdate(d3Chart) {
              d3Chart.formatter(getFormatter(conf.dataType));
              d3Chart.zValue(
                fp.flow(
                  dataLens,
                  fp.view(fp.lensProp(conf.dataType))
                )
              );
              d3Chart.xAxisDetail(conf.toReadableType(conf.dataType));
            }
          }
        };

        const config2$ = getStore.select("readWriteHeatMapCharts");
        config2$.through(getConf(page)).each((x: heatMapDurationPayloadT) => {
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

  function getFormatter(type) {
    const dataType = type.split("_").pop();

    if (dataType === "bytes")
      return function(z) {
        return formatBytes(z, 3) + "/s";
      };
    else if (dataType === "iops")
      return function(z) {
        return formatNumber(z, 2, true) + " IOPS";
      };
  }
};
