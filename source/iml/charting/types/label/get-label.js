//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import {identity} from 'intel-fp';

export function getLabelFactory (d3) {
  'ngInject';

  return function getLabel () {
    var color = '#000000';
    var fill = '#FFFFFF';
    var width = 0;
    var height = 0;
    var data = identity;

    function label (selection) {
      selection.each(function () {
        const item = d3.select(this);

        const labelGroup = item.selectAll('.label-group')
          .data(data);

        const enteringLabelGroup = labelGroup.enter()
          .append('g')
          .classed('label-group', true);

        enteringLabelGroup
          .style('opacity', 0)
          .transition()
          .style('opacity', 1);

        enteringLabelGroup
          .append('rect')
          .classed('label-rect', true);

        labelGroup
          .select('.label-rect')
          .attr('width', width)
          .attr('height', height)
          .attr('fill', fill);

        enteringLabelGroup
          .append('text')
          .classed('label-text', true);

        labelGroup
          .select('.label-text')
          .text(identity)
          .attr('x', () => width / 2)
          .attr('y', function () {
            const boundingBox = this.getBoundingClientRect();

            return (height + boundingBox.height) / 2;
          })
          .style('text-anchor', 'middle')
          .attr('fill', color);

        labelGroup.exit()
          .style('opacity', 1)
          .transition()
          .style('opacity', 0)
          .remove();
      });
    }

    label.fill = function fillAccessor (_) {
      if (!arguments.length) return fill;
      fill = _;
      return label;
    };

    label.color = function colorAccessor (_) {
      if (!arguments.length) return color;
      color = _;
      return label;
    };

    label.width = function widthAccessor (_) {
      if (!arguments.length) return width;
      width = _;
      return label;
    };

    label.height = function heightAccessor (_) {
      if (!arguments.length) return height;
      height = _;
      return label;
    };

    label.data = function dataAccessor (_) {
      if (!arguments.length) return data;
      data = _;
      return label;
    };

    return label;
  };
}
