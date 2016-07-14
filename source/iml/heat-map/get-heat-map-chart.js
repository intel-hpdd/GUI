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

export default function getHeatMapChart (nv, d3, getHeatMapLegend, getHeatMap) {
  'ngInject';

  return function getChart () {
    var margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };

    var noData = 'No Data Available.';

    var duration = 1000;

    var formatter = _.identity;
    var zValue = _.noop;
    var xAxisLabel = '';
    var xAxisDetail = '';

    var interactiveLayer = nv.interactiveGuideline();

    var x = d3.time.scale();
    var y = d3.scale.ordinal();
    var z = d3.scale.linear()
      .range([0, 1]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

    var colors = ['#8ebad9', '#d6e2f3', '#fbb4b4', '#fb8181', '#ff6262'];
    var color = d3.scale.linear()
      .range(colors)
      .domain(d3.range(0, 1, 1.0 / (colors.length - 1)).concat(1));

    var bisector = d3.bisector(xValue).left;

    // jshint -W021
    function chart (selection) {
      margin.top = 30;
      margin.left = 30;

      selection.each(function render (data) {
        var container = d3.select(this);
        var width = parseInt(container.style('width'), 10);
        var height = parseInt(container.style('height'), 10);
        var availableWidth = width - margin.left - margin.right;
        var availableHeight = height - margin.top - margin.bottom;

        var merged = _.flatten(data);

        // Display noData message if there's nothing to show.
        if (!merged.length) {
          var xPos = width / 2;
          var yPos = height / 2;

          //Remove any previously created chart components
          container.selectAll('g').remove();
          container.selectAll('.x.label').remove();

          var noDataText = container
            .selectAll('.nv-noData')
            .data([noData]);

          noDataText
            .enter()
            .append('text')
            .attr('class', 'nvd3 nv-noData')
            .attr('dy', '-.7em')
            .style('text-anchor', 'middle');

          noDataText
            .attr('x', xPos)
            .attr('y', yPos)
            .text(_.identity);

          return chart;
        } else {
          container.selectAll('.nv-noData').remove();
        }

        //------------------------------------------------------------
        // Setup containers and skeleton of chart

        // data join
        var wrap = container.selectAll('g.heat-map-chart')
          .data([data]);

        // Create the structure on enter.
        var gEnter = wrap
          .enter()
          .append('g')
          .attr('class', 'heat-map-chart');

        var chartGroupGEnter = gEnter
          .append('g')
          .attr('class', 'chart-group');

        gEnter
          .append('g')
          .attr('class', 'legend-group');

        gEnter
          .append('text')
          .attr('class', 'x label')
          .style('text-anchor', 'middle');

        chartGroupGEnter
          .append('g')
          .attr('class', 'x axis');

        chartGroupGEnter
          .append('g')
          .attr('class', 'heat-map-group');

        chartGroupGEnter
          .append('g')
          .attr('class', 'nv-interactive');

        // These operate on enter + update.
        var chartGroup = wrap.select('.chart-group')
          .attr('transform', translator(margin.left, margin.top));
        var legendGroup = wrap.select('.legend-group')
          .attr('transform', translator(margin.left, 0));
        var heatMapGroup = wrap.select('.heat-map-group');
        var interactiveGroup = wrap.select('.nv-interactive');

        var keys = _(merged)
          .pluck('name')
          .uniq()
          .value();

        x
          .domain(d3.extent(merged, xValue))
          .range([0, availableWidth]);

        y
          .domain(keys)
          .rangePoints([0, availableHeight], 1.0);

        z
          .domain(d3.extent(merged, zValue));

        //------------------------------------------------------------
        // Legend

        var legend = d3.scale
          .linear()
          .domain([0, 99])
          .range([0, 1]);

        var heatMapLegend = getHeatMapLegend();

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

        legendGroup
          .call(heatMapLegend);

        if (margin.top !== heatMapLegend.height()) {
          margin.top = heatMapLegend.height();
          availableHeight = (parseInt(container.style('height'), 10)) - margin.top - margin.bottom;

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

        var getColor = _.compose(color, z, zValue);

        interactiveLayer.dispatch.on('elementMousemove', function (e) {
          var yRange = y.range();
          var halfWidth = yRange[0] + 1;
          var r = yRange.map(function add (val) {
            return val + halfWidth;
          });

          var yIndex = d3.bisect(r, e.mouseY);

          var row = data[yIndex];
          var index = bisector(row, e.pointXValue);
          var point = row[index - 1];

          if (!point)
            return;

          interactiveLayer
            .tooltip
            .data({
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

        interactiveLayer.dispatch.on('elementClick', function (e) {
          var yRange = y.range();
          var halfWidth = yRange[0] + 1;
          var r = yRange.map(function add (val) {
            return val + halfWidth;
          });

          var yIndex = d3.bisect(r, e.mouseY);

          var row = data[yIndex];
          var index = bisector(row, e.pointXValue);
          var point = row[index - 1];

          var nextPoint = row[index];

          d3.select('.nvtooltip').remove();

          chart.dispatch.click({
            current: point,
            next: nextPoint
          });
        });

        //------------------------------------------------------------
        // Setup heatmap

        var heatMap = getHeatMap();

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

        heatMapGroup
          .datum(data)
          .call(heatMap);

        //------------------------------------------------------------
        // Setup Axes

        chartGroup.select('.x.axis')
          .attr('transform', translator(0, availableHeight))
          .transition()
          .duration(duration)
          .call(xAxis);

        var detail;

        if (xAxisDetail)
          detail = xAxisDetail + ' - ';
        else
          detail = '';

        wrap.select('.x.label')
          .attr('x', width / 2)
          .attr('y', height - 10)
          .text(detail + xAxisLabel);

        //------------------------------------------------------------

        chart.update = container.call.bind(container, chart);

        chart.destroy = function destroy () {
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

    chart.margin = function marginAccessor (_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.xAxis = _.fidentity(xAxis);

    chart.formatter = function formatterAccessor (_) {
      if (!arguments.length) return formatter;
      formatter = _;
      return chart;
    };

    chart.zValue = function zValueAccessor (_) {
      if (!arguments.length) return zValue;
      zValue = _;
      return chart;
    };

    chart.noData = function noDataAccessor (_) {
      if (!arguments.length) return noData;
      noData = _;
      return chart;
    };

    chart.xAxisLabel = function xAxisLabelAccessor (_) {
      if (!arguments.length) return xAxisLabel;
      xAxisLabel = _;
      return chart;
    };

    chart.xAxisDetail = function xAxisLabelAccessor (_) {
      if (!arguments.length) return xAxisDetail;
      xAxisDetail = _;
      return chart;
    };

    chart.duration = function durationAccessor (_) {
      if (!arguments.length) return duration;
      duration = _;
      return chart;
    };

    chart.destroy = _.noop;

    chart.dispatch = d3.dispatch('click');

    return chart;
  };

  function translator (dx, dy) {
    return 'translate(' + dx + ',' + dy + ')';
  }

  function xValue (d) {
    return new Date(d.ts);
  }
}
