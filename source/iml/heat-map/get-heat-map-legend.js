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
