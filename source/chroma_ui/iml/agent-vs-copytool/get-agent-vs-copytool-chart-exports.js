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

import {flow, eq, map, eqFn, lensProp,
  unwrap, invokeMethod} from 'intel-fp/fp';
import {pickBy, values} from 'intel-obj/obj';

export function getAgentVsCopytoolChartFactory (getAgentVsCopytoolStream, createStream, createDate,
                                                DURATIONS, chartCompiler, d3) {
  'ngInject';

  const DEFAULT_DURATION = [10, DURATIONS.MINUTES];

  return function getAgentVsCopytoolChart (overrides) {
    const durationStream = createStream.durationStream(getAgentVsCopytoolStream, overrides);
    const rangeStream = createStream.rangeStream(getAgentVsCopytoolStream, overrides);

    const template = 'iml/agent-vs-copytool/assets/html/agent-vs-copytool-chart.html';

    const xScale = d3.time.scale();
    const yScale = d3.scale.linear();
    const nameColorScale = d3.scale.ordinal()
      .domain(['running actions', 'waiting requests', 'idle workers'])
      .range(['#F3B600', '#A3B600', '#0067B4']);

    const without = flow(
      eq,
      (fn) => (x, y) => !fn(y)
    );
    const getNumbers = flow(
      pickBy(without('ts')),
      values
    );
    const getMax = flow(
      map(getNumbers),
      unwrap,
      d3.max
    );

    var getTime = invokeMethod('getTime', []);
    var xComparator = eqFn(getTime, getTime);

    const getDate = (d) => createDate(d.ts);

    function calcRange (xs) {
      const dateRange = d3.extent(xs, getDate);
      const range = moment(dateRange[0]).twix(dateRange[1]);

      return [range.format({ implicitYear: false })];
    }

    const mapProps = map(lensProp);

    return chartCompiler(template, durationStream(...DEFAULT_DURATION), ($scope, stream) => {
      const conf = {
        stream,
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
        size: DEFAULT_DURATION[0],
        unit: DEFAULT_DURATION[1],
        onSubmit ({ rangeForm, durationForm }) {
          conf.stream.destroy();

          if (rangeForm) {
            conf.stream = rangeStream(
              rangeForm.start.$modelValue,
              rangeForm.end.$modelValue
            );
          } else if (durationForm) {
            conf.stream = durationStream(
              durationForm.size.$modelValue,
              durationForm.unit.$modelValue
            );
          }
        }
      };

      $scope.$on('$destroy', () => {
        conf.stream.destroy();
      });

      return conf;
    });
  };
}
