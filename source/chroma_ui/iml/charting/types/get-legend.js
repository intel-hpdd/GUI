//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2015 Intel Corporation All Rights Reserved.
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

angular.module('charting')
  .factory('getLegend', function legendFactory (d3) {
    return function getLegend () {
      var colors;
      var width = 0;
      var height = 0;
      var radius = 5;
      var padding = 10;
      var dispatch = d3.dispatch('selection');
      var showLabels = true;
      var mapX = fp.map(fp.lensProp('x'));
      var mapY = fp.map(fp.lensProp('y'));
      var xScale = d3.scale.ordinal();
      var yScale = d3.scale.ordinal();
      var mapDimensions = fp.flow(fp.head, fp.map(fp.invokeMethod('getBoundingClientRect', [])));

      function legend (sel) {
        xScale.domain(colors.domain());
        yScale.domain(colors.domain());

        sel.each(function setData (data) {
          var container = d3.select(this).classed('chart-legend', true);

          var g = container.selectAll('g').data(data).enter()
            .append('g')
            .attr('data-name', fp.identity)
            .classed('legend-group', true);

          g
            .append('circle')
            .attr('fill', colors)
            .attr('stroke', colors)
            .attr('r', radius)
            .classed('legend-circle', true);

          g
            .append('text')
            .attr('dx', '10')
            .attr('dy', '4')
            .text(fp.identity)
            .classed('legend-label', true);

          var groups = container.selectAll('g');
          var labels = container.selectAll('g text');
          var displayType = showLabels ? 'inherit' : 'none';
          labels.attr('display', displayType);

          var itemWidths = mapDimensions(groups);

          var canFit = fp.flow(fp.tail, fp.lensProp('fits'));
          var processCoordinates = fp.cond(
            [canFit, fp.identity],
            [fp.true, fp.flow(
              fp.tap(labels.attr.bind(labels, 'display', 'none')), mapDimensions.bind(null, groups), mapToCoords)]
          );

          var updateScale = fp.curry(4, fp.flow)(mapToCoords, processCoordinates);

          var updateXScale = updateScale(mapX, xScale.range);
          updateXScale(itemWidths);

          var updateYScale = updateScale(mapY, yScale.range);
          updateYScale(itemWidths);

          groups
            .attr('transform', fp.flow(fp.arrayWrap, fp.mapFn([xScale, yScale]), fp.invoke(translate)))
            .on('click', function onClick () {
              var group = d3.select(this);
              var selected = group.attr('data-selected') === 'true';
              selected = !selected;
              group.attr('data-selected', selected);

              var groupName = group.attr('data-name');
              var opacityVal = selected ? '0' : null;

              group.select('circle').attr('fill-opacity', opacityVal);
              dispatch.selection(groupName, selected);
            });
        });
      }

      function mapToCoords (groups) {
        var pos = 0;
        var row = 0;
        var groupHeight = fp.head(groups).height;

        var coordinates = fp.map(function mapCoordinates (curObj) {
          var itemWidth = curObj.width;
          if (pos + itemWidth > width) {
            pos = itemWidth + padding;
            curObj.x = 0;
            row += 1;
          } else {
            curObj.x = pos;
            pos += itemWidth + padding;
          }

          curObj.y = row * groupHeight;
          curObj.fits = curObj.y <= height;

          return curObj;
        }, groups);

        return coordinates;
      }

      legend.colors = function colorAccessor (_) {
        if (!arguments.length) return colors;
        colors = _;
        return legend;
      };

      legend.width = function widthAccessor (_) {
        if (!arguments.length) return width;
        width = _;
        return legend;
      };

      legend.height = function heightAccessor (_) {
        if (!arguments.length) return height;
        height = _;
        return legend;
      };

      legend.padding = function paddingAccessor (_) {
        if (!arguments.length) return padding;
        padding = _;
        return legend;
      };

      legend.radius = function radiusAccessor (_) {
        if (!arguments.length) return radius;
        radius = _;
        return radius;
      };

      legend.showLabels = function showLabelsAccessor (_) {
        if (!arguments.length) return showLabels;
        showLabels = _;
        return legend;
      };

      legend.dispatch = function dispatchAccessor () {
        return dispatch;
      };

      return legend;
    };

    function translate (x, y) {
      return 'translate(%s,%s)'.sprintf(x, y);
    }
  });
