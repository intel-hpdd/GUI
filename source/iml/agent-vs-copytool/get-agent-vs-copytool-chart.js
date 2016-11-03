// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import flatMapChanges from 'intel-flat-map-changes';
import * as fp from 'intel-fp';

import {
  pickBy,
  values
} from 'intel-obj';
import {
  DEFAULT_AGENT_VS_COPYTOOL_CHART_ITEMS,
  UPDATE_AGENT_VS_COPYTOOL_CHART_ITEMS
} from './agent-vs-copytool-chart-reducer.js';
import moment from 'moment';
import getAgentVsCopytoolStream from './get-agent-vs-copytool-stream.js';
import createDate from '../create-date.js';
import getStore from '../store/get-store.js';
import durationPayload from '../duration-picker/duration-payload.js';
import durationSubmitHandler from '../duration-picker/duration-submit-handler.js';
import chartCompiler from '../chart-compiler/chart-compiler.js';
import d3 from 'd3';

import {
  getConf
} from '../chart-transformers/chart-transformers.js';

import type {
  durationPayloadT
} from '../duration-picker/duration-picker-module.js';
import type {
  localApplyT
} from '../extend-scope-module.js';
import type {
  data$FnT
} from '../chart-transformers/chart-transformers-module.js';

import agentVsCopytoolTemplate from './assets/html/agent-vs-copytool-chart.html!text';

export default (localApply:localApplyT, data$Fn:data$FnT) => {
  'ngInject';

  return function getAgentVsCopytoolChart (overrides:Object) {
    const page = 'base';

    getStore.dispatch({
      type: DEFAULT_AGENT_VS_COPYTOOL_CHART_ITEMS,
      payload: durationPayload({page})
    });

    const config1$ = getStore.select('agentVsCopytoolCharts');
    const initStream = config1$
      .through(getConf(page))
      .through(
        flatMapChanges(
          data$Fn(overrides, fp.always(getAgentVsCopytoolStream))
        )
      );

    const xScale = d3.time.scale();
    const yScale = d3.scale.linear();
    const nameColorScale = d3.scale.ordinal()
      .domain(['running actions', 'waiting requests', 'idle workers'])
      .range(['#F3B600', '#A3B600', '#0067B4']);

    const without = fp.flow(
      fp.eq,
      (fn) => (x, y) => !fn(y)
    );
    const getNumbers = fp.flow(
      pickBy(without('ts')),
      values
    );
    const getMax = fp.flow(
      fp.map(getNumbers),
      fp.unwrap,
      d3.max
    );

    var getTime = fp.invokeMethod('getTime', []);
    var xComparator = fp.eqFn(getTime, getTime);

    const getDate = (d) => createDate(d.ts);

    function calcRange (xs) {
      const dateRange = d3.extent(xs, getDate);
      const range = moment(dateRange[0]).twix(dateRange[1]);

      return [range.format({ implicitYear: false })];
    }

    const mapProps = fp.map(fp.flow(fp.lensProp, fp.view));

    return chartCompiler(agentVsCopytoolTemplate, initStream, ($scope, stream) => {
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
          ({xs}) => xScale.domain(d3.extent(xs, getDate)),
          ({xs}) => yScale.domain([0, getMax(xs) + 1]),
          ({width}) => xScale.range([0, width]),
          ({height}) => yScale.range([height - 20, 30])
        ],
        rangeLabelOnUpdate: [
          ({label, width}) => label.width(width),
          ({label}) => label.height(20),
          ({node, height}) => node.attr('transform', `translate(0,${height})`)
        ],
        nameColorScale,
        calcRange,
        xValue: getDate,
        xComparator,
        labels: mapProps(nameColorScale.domain()),
        colors: nameColorScale.range(),
        onSubmit: durationSubmitHandler(UPDATE_AGENT_VS_COPYTOOL_CHART_ITEMS, {page})
      };

      const config2$ = getStore.select('agentVsCopytoolCharts');
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
