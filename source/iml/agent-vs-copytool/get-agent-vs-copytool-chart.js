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
import * as fp from '@mfl/fp';

import { entries } from '@mfl/obj';
import {
  DEFAULT_AGENT_VS_COPYTOOL_CHART_ITEMS,
  UPDATE_AGENT_VS_COPYTOOL_CHART_ITEMS
} from './agent-vs-copytool-chart-reducer.js';
import moment from 'moment';
import getAgentVsCopytoolStream from './get-agent-vs-copytool-stream.js';
import createDate from '../create-date.js';
import getStore from '../store/get-store.js';
import durationPayload from '../duration-picker/duration-payload.js';
import durationSubmitHandler
  from '../duration-picker/duration-submit-handler.js';
import chartCompiler from '../chart-compiler/chart-compiler.js';
import d3 from 'd3';

import { getConf } from '../chart-transformers/chart-transformers.js';

import type {
  durationPayloadT
} from '../duration-picker/duration-picker-module.js';
import type { localApplyT } from '../extend-scope-module.js';
import type {
  data$FnT
} from '../chart-transformers/chart-transformers-module.js';

export default (localApply: localApplyT, data$Fn: data$FnT) => {
  'ngInject';
  return function getAgentVsCopytoolChart(overrides: Object) {
    const page = 'base';

    getStore.dispatch({
      type: DEFAULT_AGENT_VS_COPYTOOL_CHART_ITEMS,
      payload: durationPayload({ page })
    });

    const config1$ = getStore.select('agentVsCopytoolCharts');
    const initStream = config1$
      .through(getConf(page))
      .through(
        flatMapChanges.bind(
          null,
          data$Fn.bind(null, overrides, () => getAgentVsCopytoolStream)
        )
      );

    const xScale = d3.time.scale();
    const yScale = d3.scale.linear();
    const nameColorScale = d3.scale
      .ordinal()
      .domain(['running actions', 'waiting requests', 'idle workers'])
      .range(['#F3B600', '#A3B600', '#0067B4']);

    const getNumbers = x =>
      entries(x).filter(([k]) => k !== 'ts').map(([, v]) => v);

    const getMax = fp.flow(fp.map(getNumbers), xs => [].concat(...xs), d3.max);

    const getTime = fp.invokeMethod('getTime')([]);
    const xComparator = fp.eqFn(getTime)(getTime);

    const getDate = d => createDate(d.ts);

    function calcRange(xs) {
      const dateRange = d3.extent(xs, getDate);
      const range = moment(dateRange[0]).twix(dateRange[1]);

      return [range.format({ implicitYear: false })];
    }

    const mapProps = fp.map(fp.flow(fp.lensProp, fp.view));

    return chartCompiler(
      `<div config-toggle class="agent-vs-copytool">
  <div class="controls" ng-if="configToggle.inactive()">
    <button class="btn btn-xs btn-primary" ng-click="configToggle.setActive()">Configure <i class="fa fa-cog"></i></button>
  </div>
  <div class="configuration" ng-if="configToggle.active()">
    <div class="well well-lg">
      <form name="form">
        <resettable-group>
          <duration-picker type="chart.configType" size="chart.size" unit="chart.unit" start-date="chart.startDate | toDate" end-date="chart.endDate | toDate"></duration-picker>
          <button type="submit"
                  ng-click="::configToggle.setInactive(chart.onSubmit({}, form))"
                  class="btn btn-success btn-block"
                  ng-disabled="form.$invalid">Update</button>
          <button ng-click="::configToggle.setInactive()" class="btn btn-cancel btn-block" resetter>Cancel</button>
        </resettable-group>
      </form>
    </div>
  </div>
  <div charter class="agent-vs-copytool-chart" stream="chart.stream" on-update="::chart.onUpdate">
    <g axis scale="::chart.yScale" orient="'left'"></g>
    <g axis scale="::chart.xScale" orient="'bottom'"></g>
    <g legend scale="::chart.nameColorScale"></g>
    <g label on-data="::chart.calcRange" on-update="::chart.rangeLabelOnUpdate"></g>
    <g line scale-y="::chart.yScale" scale-x="::chart.xScale" value-x="::chart.xValue" value-y="::chart.labels[0]" color="::chart.colors[0]" comparator-x="::chart.xComparator"></g>
    <g line scale-y="::chart.yScale" scale-x="::chart.xScale" value-x="::chart.xValue" value-y="::chart.labels[1]" color="::chart.colors[1]" comparator-x="::chart.xComparator"></g>
    <g line scale-y="::chart.yScale" scale-x="::chart.xScale" value-x="::chart.xValue" value-y="::chart.labels[2]" color="::chart.colors[2]" comparator-x="::chart.xComparator"></g>
  </div>
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
          xScale,
          yScale,
          onUpdate: [
            ({ xs }) => xScale.domain(d3.extent(xs, getDate)),
            ({ xs }) => yScale.domain([0, getMax(xs) + 1]),
            ({ width }) => xScale.range([0, width]),
            ({ height }) => yScale.range([height - 20, 30])
          ],
          rangeLabelOnUpdate: [
            ({ label, width }) => label.width(width),
            ({ label }) => label.height(20),
            ({ node, height }) =>
              node.attr('transform', `translate(0,${height})`)
          ],
          nameColorScale,
          calcRange,
          xValue: getDate,
          xComparator,
          labels: mapProps(nameColorScale.domain()),
          colors: nameColorScale.range(),
          onSubmit: durationSubmitHandler(
            UPDATE_AGENT_VS_COPYTOOL_CHART_ITEMS,
            { page }
          )
        };

        const config2$ = getStore.select('agentVsCopytoolCharts');
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
