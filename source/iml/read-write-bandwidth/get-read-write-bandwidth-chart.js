// @flow

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

import flatMapChanges from '@mfl/flat-map-changes';
import getReadWriteBandwidthStream from './get-read-write-bandwidth-stream.js';
import { formatBytes } from '@mfl/number-formatters';
import durationPayload from '../duration-picker/duration-payload.js';
import durationSubmitHandler from '../duration-picker/duration-submit-handler.js';
import getStore from '../store/get-store.js';
import chartCompiler from '../chart-compiler/chart-compiler.js';

import {
  DEFAULT_READ_WRITE_BANDWIDTH_CHART_ITEMS,
  UPDATE_READ_WRITE_BANDWIDTH_CHART_ITEMS
} from './read-write-bandwidth-chart-reducer.js';
import { getConf } from '../chart-transformers/chart-transformers.js';

import type { data$FnT } from '../chart-transformers/chart-transformers-module.js';
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
        flatMapChanges.bind(
          null,
          data$Fn.bind(null, overrides, () => getReadWriteBandwidthStream)
        )
      );

    return chartCompiler(
      `<div config-toggle>
  <h5>Read/Write Bandwidth</h5>
  <div class="controls" ng-if="configToggle.inactive()">
    <button class="btn btn-xs btn-primary" ng-click="configToggle.setActive()">Configure <i class="fa fa-cog"></i></button>
    <a full-screen-btn class="btn btn-primary btn-xs"></a>
    <a class="drag btn btn-xs btn-default">Drag <i class="fa fa-arrows"></i></a>
  </div>
  <div class="configuration" ng-if="configToggle.active()">
    <div class="well well-lg">
      <form name="readWriteBandwidthForm">
        <resettable-group>
          <duration-picker type="chart.configType" size="chart.size" unit="chart.unit" start-date="chart.startDate | toDate" end-date="chart.endDate | toDate"></duration-picker>
          <button type="submit" ng-click="::configToggle.setInactive(chart.onSubmit({}, readWriteBandwidthForm))" class="btn btn-success btn-block" ng-disabled="readWriteBandwidthForm.$invalid">Update</button>
          <button ng-click="::configToggle.setInactive()" class="btn btn-cancel btn-block" resetter>Cancel</button>
        </resettable-group>
      </form>
    </div>
  </div>
  <line-chart options="::chart.options" stream="::chart.stream"></line-chart>
</div>`,
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
