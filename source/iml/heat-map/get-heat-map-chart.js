//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from '@mfl/lodash-mixins';
import d3 from 'd3';
import nv from 'nvd3';
import getHeatMapLegend from './get-heat-map-legend.js';
import getHeatMap from './get-heat-map.js';

const translator = (dx, dy) => {
  return 'translate(' + dx + ',' + dy + ')';
};

const xValue = d => {
  return new Date(d.ts);
};

export default () => {
  let margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };

  let noData = 'No Data Available.';

  let duration = 1000;

  let formatter = _.identity;
  let zValue = _.noop;
  let xAxisLabel = '';
  let xAxisDetail = '';

  const interactiveLayer = nv.interactiveGuideline();

  const x = d3.time.scale();
  const y = d3.scale.ordinal();
  const z = d3.scale.linear().range([0, 1]);

  const xAxis = d3.svg.axis().scale(x).orient('bottom');

  const colors = ['#8ebad9', '#d6e2f3', '#fbb4b4', '#fb8181', '#ff6262'];
  const color = d3.scale
    .linear()
    .range(colors)
    .domain(d3.range(0, 1, 1.0 / (colors.length - 1)).concat(1));

  const bisector = d3.bisector(xValue).left;

  // jshint -W021
  function chart(selection) {
    margin.top = 30;
    margin.left = 30;

    selection.each(function render(data) {
      let container = d3.select(this);
      const width = parseInt(container.style('width'), 10);
      const height = parseInt(container.style('height'), 10);
      const availableWidth = width - margin.left - margin.right;
      let availableHeight = height - margin.top - margin.bottom;

      const merged = _.flatten(data);

      // Display noData message if there's nothing to show.
      if (!merged.length) {
        const xPos = width / 2;
        const yPos = height / 2;

        //Remove any previously created chart components
        container.selectAll('g').remove();
        container.selectAll('.x.label').remove();

        const noDataText = container.selectAll('.nv-noData').data([noData]);

        noDataText
          .enter()
          .append('text')
          .attr('class', 'nvd3 nv-noData')
          .attr('dy', '-.7em')
          .style('text-anchor', 'middle');

        noDataText.attr('x', xPos).attr('y', yPos).text(_.identity);

        return chart;
      } else {
        container.selectAll('.nv-noData').remove();
      }

      //------------------------------------------------------------
      // Setup containers and skeleton of chart

      // data join
      let wrap = container.selectAll('g.heat-map-chart').data([data]);

      // Create the structure on enter.
      let gEnter = wrap.enter().append('g').attr('class', 'heat-map-chart');

      let chartGroupGEnter = gEnter.append('g').attr('class', 'chart-group');

      gEnter.append('g').attr('class', 'legend-group');

      gEnter
        .append('text')
        .attr('class', 'x label')
        .style('text-anchor', 'middle');

      chartGroupGEnter.append('g').attr('class', 'x axis');

      chartGroupGEnter.append('g').attr('class', 'heat-map-group');

      chartGroupGEnter.append('g').attr('class', 'nv-interactive');

      // These operate on enter + update.
      const chartGroup = wrap
        .select('.chart-group')
        .attr('transform', translator(margin.left, margin.top));
      const legendGroup = wrap
        .select('.legend-group')
        .attr('transform', translator(margin.left, 0));
      const heatMapGroup = wrap.select('.heat-map-group');
      const interactiveGroup = wrap.select('.nv-interactive');

      const keys = _(merged).pluck('name').uniq().value();

      x.domain(d3.extent(merged, xValue)).range([0, availableWidth]);

      y.domain(keys).rangePoints([0, availableHeight], 1.0);

      z.domain(d3.extent(merged, zValue));

      //------------------------------------------------------------
      // Legend

      const legend = d3.scale.linear().domain([0, 99]).range([0, 1]);

      let heatMapLegend = getHeatMapLegend();

      heatMapLegend
        .width(availableWidth)
        .height(30)
        .margin({
          top: 5,
          right: 0,
          bottom: 5,
          left: 0
        })
        .colorScale(color)
        .legendScale(legend)
        .zScale(z)
        .formatter(formatter);

      legendGroup.call(heatMapLegend);

      if (margin.top !== heatMapLegend.height()) {
        margin.top = heatMapLegend.height();
        availableHeight =
          parseInt(container.style('height'), 10) - margin.top - margin.bottom;
        chartGroup.attr('transform', translator(0, margin.top));
      }

      //------------------------------------------------------------
      // Setup interactive layer

      interactiveLayer
        .width(availableWidth)
        .height(availableHeight)
        .margin({
          left: margin.left,
          top: margin.top
        })
        .svgContainer(container)
        .xScale(x);

      interactiveGroup.call(interactiveLayer);

      const getColor = _.compose(color, z, zValue);

      interactiveLayer.dispatch.on('elementMousemove', function(e) {
        const yRange = y.range();
        const halfWidth = yRange[0] + 1;
        const r = yRange.map(function add(val) {
          return val + halfWidth;
        });

        const yIndex = d3.bisect(r, e.mouseY);

        const row = data[yIndex];
        const index = bisector(row, e.pointXValue);
        const point = row[index - 1];

        if (!point) return;

        interactiveLayer.tooltip.data({
          value: xAxis.tickFormat()(e.pointXValue),
          series: [
            {
              key: y.domain()[yIndex],
              value: formatter(zValue(point)),
              color: getColor(point)
            }
          ]
        })();

        interactiveLayer.renderGuideLine(e.mouseX);
      });

      interactiveLayer.dispatch.on('elementClick', function(e) {
        const yRange = y.range();
        const halfWidth = yRange[0] + 1;
        const r = yRange.map(function add(val) {
          return val + halfWidth;
        });

        const yIndex = d3.bisect(r, e.mouseY);

        const row = data[yIndex];
        const index = bisector(row, e.pointXValue);
        const point = row[index - 1];

        const nextPoint = row[index];

        d3.select('.nvtooltip').remove();

        chart.dispatch.click({
          current: point,
          next: nextPoint
        });
      });

      //------------------------------------------------------------
      // Setup heatmap

      let heatMap = getHeatMap();

      heatMap
        .width(availableWidth)
        .height(availableHeight)
        .duration(duration)
        .xScale(x)
        .yScale(y)
        .zScale(z)
        .xValue(xValue)
        .yValue(_.property('name'))
        .zValue(zValue)
        .colorScale(color);

      heatMapGroup.datum(data).call(heatMap);

      //------------------------------------------------------------
      // Setup Axes
      chartGroup
        .select('.x.axis')
        .attr('transform', translator(0, availableHeight))
        .transition()
        .duration(duration)
        .call(xAxis);

      let detail;

      if (xAxisDetail) detail = xAxisDetail + ' - ';
      else detail = '';

      wrap
        .select('.x.label')
        .attr('x', width / 2)
        .attr('y', height - 10)
        .text(detail + xAxisLabel);

      //------------------------------------------------------------

      chart.update = container.call.bind(container, chart);

      chart.destroy = function destroy() {
        chart.update = null;
        chart.dispatch.on('click', null);

        heatMap.destroy();
        heatMapLegend.destroy();
        container.remove();

        chart = heatMap = heatMapLegend = container = wrap = gEnter = chartGroupGEnter = null;
      };
    });
  }

  // jshint +W021

  chart.margin = function marginAccessor(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.xAxis = _.fidentity(xAxis);

  chart.formatter = function formatterAccessor(_) {
    if (!arguments.length) return formatter;
    formatter = _;
    return chart;
  };

  chart.zValue = function zValueAccessor(_) {
    if (!arguments.length) return zValue;
    zValue = _;
    return chart;
  };

  chart.noData = function noDataAccessor(_) {
    if (!arguments.length) return noData;
    noData = _;
    return chart;
  };

  chart.xAxisLabel = function xAxisLabelAccessor(_) {
    if (!arguments.length) return xAxisLabel;
    xAxisLabel = _;
    return chart;
  };

  chart.xAxisDetail = function xAxisLabelAccessor(_) {
    if (!arguments.length) return xAxisDetail;
    xAxisDetail = _;
    return chart;
  };

  chart.duration = function durationAccessor(_) {
    if (!arguments.length) return duration;
    duration = _;
    return chart;
  };

  chart.destroy = _.noop;

  chart.dispatch = d3.dispatch('click');

  return chart;
};
