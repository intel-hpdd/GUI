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

import _ from '@mfl/lodash-mixins';
import d3 from 'd3';

export default function getHeatMapFactory() {
  'ngInject';
  return function getHeatMap() {
    let xScale = _.noop;
    let yScale = _.noop;
    let xValue = _.noop;
    let yValue = _.noop;
    let zValue = _.noop;
    let zScale = _.noop;
    let colorScale = _.noop;
    let width = 0;
    let height = 0;
    let duration = 1000;

    function chart(selection) {
      selection.each(function render(data) {
        let container = d3.select(this);

        chart.destroy = function destroy() {
          container.remove();
          container = selection = null;
        };

        const getX = _.compose(xScale, xValue);
        const getY = _.compose(yScale, yValue);
        const getColor = _.compose(colorScale, zScale, zValue);

        // data join
        const heatMapModel = container
          .selectAll('.heat-map-model')
          .data([data]);

        // Create the structure on enter.
        heatMapModel.enter().append('g').attr('class', 'heat-map-model');

        const row = heatMapModel.selectAll('.row').data(_.identity);

        row.enter().append('g').attr('class', 'row');

        const gridHeight = height / yScale.domain().length;

        row.attr('transform', function(r) {
          return (
            'translate(0,' + Math.max(getY(r[0]) - gridHeight / 2, 0) + ')'
          );
        });

        row.exit().remove();

        const cell = row.selectAll('.cell').data(_.identity, xValue);

        cell
          .attr('height', gridHeight)
          .transition()
          .duration(duration)
          .ease('linear')
          .attr('width', calcWidth)
          .attr('x', getX)
          .attr('fill', getColor);

        cell
          .enter()
          .append('rect')
          .attr('class', 'cell')
          .attr('fill', getColor)
          .attr('width', calcWidth)
          .attr('height', gridHeight)
          .transition()
          .duration(duration)
          .ease('linear')
          .attr('x', getX);

        cell
          .exit()
          .transition()
          .duration(duration)
          .ease('linear')
          .attr('width', 0)
          .remove();

        function calcWidth(d, i, a) {
          const next = data[a][i + 1];

          const end = next ? getX(next) : width;

          return end - getX(d);
        }
      });
    }

    chart.xValue = function xValueAccessor(_) {
      if (!arguments.length) return xValue;
      xValue = _;
      return chart;
    };

    chart.yValue = function yValueAccessor(_) {
      if (!arguments.length) return yValue;
      yValue = _;
      return chart;
    };

    chart.zValue = function zValueAccessor(_) {
      if (!arguments.length) return zValue;
      zValue = _;
      return chart;
    };

    chart.xScale = function xScaleAccessor(_) {
      if (!arguments.length) return xScale;
      xScale = _;
      return chart;
    };

    chart.yScale = function yScaleAccessor(_) {
      if (!arguments.length) return yScale;
      yScale = _;
      return chart;
    };

    chart.zScale = function zScaleAccessor(_) {
      if (!arguments.length) return zScale;
      zScale = _;
      return chart;
    };

    chart.colorScale = function colorScaleAccessor(_) {
      if (!arguments.length) return colorScale;
      colorScale = _;
      return chart;
    };

    chart.width = function widthAccessor(_) {
      if (!arguments.length) return width;
      width = _;
      return chart;
    };

    chart.height = function heightAccessor(_) {
      if (!arguments.length) return height;
      height = _;
      return chart;
    };

    chart.duration = function durationAccessor(_) {
      if (!arguments.length) return duration;
      duration = _;
      return chart;
    };

    chart.destroy = _.noop;

    return chart;
  };
}
