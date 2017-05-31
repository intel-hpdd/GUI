//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from 'intel-lodash-mixins';

export default function getHeatMapLegendFactory (d3) {
  'ngInject';

  var TEXT_PADDING = 5;
  var STEP_WIDTH = 1;
  var colorScale = _.noop;
  var legendScale = _.noop;
  var zScale = _.noop;
  var formatter = _.identity;
  var width = 0;
  var height = 0;
  var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };

  return function getHeatMapLegend () {
    function chart (selection) {
      selection.each(function iterateSelections () {
        var container = d3.select(this);

        var availableWidth = width - margin.left - margin.right;
        var availableHeight = height - margin.top - margin.bottom;

        //data join.
        var wrap = container
          .selectAll('.heat-map-legend')
          .data([legendScale.ticks(100)]);

        // setup structure on enter.
        var gEnter = wrap
          .enter()
          .append('g')
          .attr('class', 'heat-map-legend');

        gEnter
          .append('text')
          .attr('class', 'min');

        gEnter
          .append('g')
          .attr('class', 'steps');

        gEnter
          .append('text')
          .attr('class', 'max');

        // These operate on enter + update.
        var minText = wrap.select('.min');
        var stepsGroup = wrap.select('.steps');
        var maxText = wrap.select('.max');

        var Y_TEXT_OFFSET = '1.2em';

        var step = stepsGroup
          .selectAll('.step')
          .data(_.identity);

        var fill = _.compose(colorScale, legendScale);

        step.enter()
          .append('rect')
          .attr('class', 'step')
          .attr('width', STEP_WIDTH)
          .attr('height', 11)
          .attr('x', function calcWidth (d, i) {
            return i * STEP_WIDTH;
          })
          .attr('fill', fill);

        var domain = zScale.domain();

        minText.text(formatter(domain[0]));
        maxText.text(formatter(domain[1]));

        var stepsBBox = getBBox(stepsGroup);
        var minBBox = getBBox(minText);
        var maxBBox = getBBox(maxText);

        var minAndStepsWidth = minBBox.width + stepsBBox.width + (TEXT_PADDING * 2);

        var legendWidth = minAndStepsWidth + maxBBox.width;

        stepsGroup
          .attr('transform',
            'translate(' + (minBBox.width + TEXT_PADDING) + ',' + ((availableHeight - 10) / 2 ) + ')');

        minText
          .attr('dy', Y_TEXT_OFFSET);

        maxText
          .attr('x', minAndStepsWidth)
          .attr('dy', Y_TEXT_OFFSET);

        wrap
          .attr('transform', 'translate(' + (availableWidth - legendWidth) + ',' + margin.top + ')');

        chart.destroy = function destroy () {
          container.remove();
          container = null;
        };
      });
    }

    chart.colorScale = function colorScaleAccessor (_) {
      if (!arguments.length) return colorScale;
      colorScale = _;
      return chart;
    };

    chart.legendScale = function legendScaleAccessor (_) {
      if (!arguments.length) return legendScale;
      legendScale = _;
      return chart;
    };

    chart.zScale = function zScaleAccessor (_) {
      if (!arguments.length) return zScale;
      zScale = _;
      return chart;
    };

    chart.formatter = function formatterAccessor (_) {
      if (!arguments.length) return formatter;
      formatter = _;
      return chart;
    };

    chart.width = function widthAccessor (_) {
      if (!arguments.length) return width;
      width = _;
      return chart;
    };

    chart.height = function heightAccessor (_) {
      if (!arguments.length) return height;
      height = _;
      return chart;
    };

    chart.margin = function heightAccessor (_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.destroy = _.noop;

    return chart;
  };

  function getBBox (selection) {
    return selection.node().getBBox();
  }
}
