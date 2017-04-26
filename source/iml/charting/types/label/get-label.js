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

import * as fp from '@mfl/fp';

export function getLabelFactory(d3) {
  'ngInject';
  return function getLabel() {
    let color = '#000000';
    let fill = '#FFFFFF';
    let width = 0;
    let height = 0;
    let data = fp.identity;

    function label(selection) {
      selection.each(function() {
        const item = d3.select(this);

        const labelGroup = item.selectAll('.label-group').data(data);

        const enteringLabelGroup = labelGroup
          .enter()
          .append('g')
          .classed('label-group', true);

        enteringLabelGroup.style('opacity', 0).transition().style('opacity', 1);

        enteringLabelGroup.append('rect').classed('label-rect', true);

        labelGroup
          .select('.label-rect')
          .attr('width', width)
          .attr('height', height)
          .attr('fill', fill);

        enteringLabelGroup.append('text').classed('label-text', true);

        labelGroup
          .select('.label-text')
          .text(fp.identity)
          .attr('x', () => width / 2)
          .attr('y', function() {
            const boundingBox = this.getBoundingClientRect();

            return (height + boundingBox.height) / 2;
          })
          .style('text-anchor', 'middle')
          .attr('fill', color);

        labelGroup
          .exit()
          .style('opacity', 1)
          .transition()
          .style('opacity', 0)
          .remove();
      });
    }

    label.fill = function fillAccessor(_) {
      if (!arguments.length) return fill;
      fill = _;
      return label;
    };

    label.color = function colorAccessor(_) {
      if (!arguments.length) return color;
      color = _;
      return label;
    };

    label.width = function widthAccessor(_) {
      if (!arguments.length) return width;
      width = _;
      return label;
    };

    label.height = function heightAccessor(_) {
      if (!arguments.length) return height;
      height = _;
      return label;
    };

    label.data = function dataAccessor(_) {
      if (!arguments.length) return data;
      data = _;
      return label;
    };

    return label;
  };
}
