//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from '@iml/lodash-mixins';
import d3 from 'd3';

export default () => {
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

      const getX = _.compose(
        xScale,
        xValue
      );
      const getY = _.compose(
        yScale,
        yValue
      );
      const getColor = _.compose(
        colorScale,
        zScale,
        zValue
      );

      // data join
      const heatMapModel = container.selectAll('.heat-map-model').data([data]);

      // Create the structure on enter.
      heatMapModel
        .enter()
        .append('g')
        .attr('class', 'heat-map-model');

      const row = heatMapModel.selectAll('.row').data(_.identity);

      row
        .enter()
        .append('g')
        .attr('class', 'row');

      const gridHeight = height / yScale.domain().length;

      row.attr('transform', function(r) {
        return 'translate(0,' + Math.max(getY(r[0]) - gridHeight / 2, 0) + ')';
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
