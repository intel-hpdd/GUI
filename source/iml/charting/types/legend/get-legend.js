//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';

const viewLens = fp.flow(
  fp.lensProp,
  fp.view
);

export function getLegendFactory (d3) {
  'ngInject';

  return function getLegend () {
    let colors;
    let width = 0;
    let height = 0;
    let radius = 5;
    let padding = 10;
    const dispatch = d3.dispatch('selection');
    let showLabels = true;
    const mapX = fp.map(viewLens('x'));
    const mapY = fp.map(viewLens('y'));
    const xScale = d3.scale.ordinal();
    const yScale = d3.scale.ordinal();

    const mapDimensions = fp.flow(
      fp.head,
      fp.map(
        fp.invokeMethod('getBoundingClientRect', [])
      )
    );

    const translate = (x, y) => `translate(${x},${y})`;

    function legend (sel) {
      xScale.domain(colors.domain());
      yScale.domain(colors.domain());

      sel.each(function setData () {
        const container = d3
          .select(this)
          .classed('chart-legend', true);

        const groups = container
          .selectAll('.legend-group')
          .data(colors.domain());

        const enteringGroups = groups.enter()
          .append('g')
          .classed('legend-group', true);

        enteringGroups
          .append('circle')
          .classed('legend-circle', true)
          .attr('fill', colors)
          .attr('stroke', colors)
          .attr('fill-opacity', 0)
          .attr('r', radius)
          .transition()
          .attr('fill-opacity', 1);

        enteringGroups
          .append('text')
          .classed('legend-label', true)
          .text(fp.identity)
          .attr('dx', '10')
          .attr('dy', '4');

        const labels = container.selectAll('g text');
        const displayType = showLabels ? 'inherit' : 'none';
        labels.attr('display', displayType);

        const itemWidths = mapDimensions(groups);

        const canFit = fp.flow(
          fp.last,
          viewLens('fits')
        );
        const processCoordinates = fp.cond(
          [canFit, fp.identity],
          [fp.True, fp.flow(
            fp.tap(labels.attr.bind(labels, 'display', 'none')),
            mapDimensions.bind(null, groups),
            mapToCoords
          )]
        );

        const updateScale = fp.curry4(fp.flow)(mapToCoords, processCoordinates);

        const updateXScale = updateScale(mapX, xScale.range);
        updateXScale(itemWidths);

        const updateYScale = updateScale(mapY, yScale.range);
        updateYScale(itemWidths);

        groups
          .attr('transform', fp.flow(
            fp.arrayWrap,
            fp.mapFn([xScale, yScale]),
            fp.invoke(translate)
          ))
          .on('click', function onClick () {
            const group = d3.select(this);

            let selected = group.attr('data-selected') === 'true';
            selected = !selected;
            group.attr('data-selected', selected);

            const opacityVal = selected ? 0 : 1;

            group.select('circle')
              .transition()
              .attr('fill-opacity', opacityVal);
            dispatch.selection(
              fp.head(group.data()),
              selected
            );
          });
      });
    }

    function mapToCoords (groups) {
      let pos = 0;
      let row = 1;
      const groupHeight = fp.head(groups).height;

      return fp.map(function mapCoordinates (curObj) {
        const itemWidth = curObj.width;
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
}
