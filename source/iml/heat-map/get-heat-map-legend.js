//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import d3 from "d3";

function getBBox(selection) {
  return selection.node().getBBox();
}

export default () => {
  const TEXT_PADDING = 5;
  const STEP_WIDTH = 1;
  let colorScale = () => {};
  let legendScale = () => {};
  let zScale = () => {};
  let formatter = x => x;
  let width = 0;
  let height = 0;
  let margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };

  function chart(selection) {
    selection.each(function iterateSelections() {
      let container = d3.select(this);

      const availableWidth = width - margin.left - margin.right;
      const availableHeight = height - margin.top - margin.bottom;

      //data join.
      const wrap = container.selectAll(".heat-map-legend").data([legendScale.ticks(100)]);

      // setup structure on enter.
      const gEnter = wrap
        .enter()
        .append("g")
        .attr("class", "heat-map-legend");

      gEnter.append("text").attr("class", "min");

      gEnter.append("g").attr("class", "steps");

      gEnter.append("text").attr("class", "max");

      // These operate on enter + update.
      const minText = wrap.select(".min");
      const stepsGroup = wrap.select(".steps");
      const maxText = wrap.select(".max");

      const Y_TEXT_OFFSET = "1.2em";

      const step = stepsGroup.selectAll(".step").data(x => x);

      const fill = fp.compose(
        colorScale,
        legendScale
      );

      step
        .enter()
        .append("rect")
        .attr("class", "step")
        .attr("width", STEP_WIDTH)
        .attr("height", 11)
        .attr("x", function calcWidth(d, i) {
          return i * STEP_WIDTH;
        })
        .attr("fill", fill);

      const domain = zScale.domain();

      minText.text(formatter(domain[0]));
      maxText.text(formatter(domain[1]));

      const stepsBBox = getBBox(stepsGroup);
      const minBBox = getBBox(minText);
      const maxBBox = getBBox(maxText);

      const minAndStepsWidth = minBBox.width + stepsBBox.width + TEXT_PADDING * 2;

      const legendWidth = minAndStepsWidth + maxBBox.width;

      stepsGroup.attr(
        "transform",
        "translate(" + (minBBox.width + TEXT_PADDING) + "," + (availableHeight - 10) / 2 + ")"
      );

      minText.attr("dy", Y_TEXT_OFFSET);

      maxText.attr("x", minAndStepsWidth).attr("dy", Y_TEXT_OFFSET);

      wrap.attr("transform", "translate(" + (availableWidth - legendWidth) + "," + margin.top + ")");

      chart.destroy = function destroy() {
        container.remove();
        container = null;
      };
    });
  }

  chart.colorScale = function colorScaleAccessor(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return chart;
  };

  chart.legendScale = function legendScaleAccessor(_) {
    if (!arguments.length) return legendScale;
    legendScale = _;
    return chart;
  };

  chart.zScale = function zScaleAccessor(_) {
    if (!arguments.length) return zScale;
    zScale = _;
    return chart;
  };

  chart.formatter = function formatterAccessor(_) {
    if (!arguments.length) return formatter;
    formatter = _;
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

  chart.margin = function heightAccessor(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.destroy = () => {};

  return chart;
};
