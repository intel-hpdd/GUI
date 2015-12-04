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

export function getLineFactory ($location, d3) {
  'ngInject';

  var counter = 0;

  return function getLine () {
    var xScale = fp.noop;
    var yScale = fp.noop;
    var xValue = fp.noop;
    var yValue = fp.noop;
    var xComparator = fp.noop;
    var color = '#000000';

    var count = counter += 1;

    const strPlusCount = (str) => str + count;

    function line (selection) {
      selection.each(function setData (data) {
        const item = d3.select(this);

        const clipCount = strPlusCount('clip');

        const clip = item.selectAll(`.${clipCount}`).data(['foo']);

        clip.enter()
          .append('defs')
          .attr('class', clipCount)
          .append('svg:clipPath')
          .attr('id', clipCount)
          .append('svg:rect');

        clip.selectAll('rect')
          .attr('width', xScale.range()[1])
          .attr('height', yScale.range()[0]);

        const line = d3.svg.line()
          .x(fp.flow(xValue, xScale))
          .y(fp.flow(yValue, yScale));

        const lineCount = strPlusCount('line');
        const lineClassCount = `.${lineCount}`;

        var lineEl = item.selectAll(lineClassCount);

        const shouldShift = lineEl.size() && data.length &&
          !xComparator(xValue(data[0]), xValue(lineEl.datum()[0]));

        if (shouldShift)
          data = [lineEl.datum()[0]].concat(data);

        const wrappedData = data.length ? [data] : data;
        lineEl = lineEl.data(wrappedData, xValue);

        lineEl
          .transition()
          .attr('d', line)
          .each('end', function removeOldPoint () {
            if (shouldShift)
              d3.select(this)
                .datum(data.slice(1))
                .attr('d', line);
          });

        lineEl.enter()
          .append('g')
          .attr('clip-path', `url(${$location.absUrl()}${strPlusCount('#clip')})`)
          .attr('class', strPlusCount('clipPath'))
          .append('svg:path')
          .classed(`line ${lineCount}`, true)
          .attr('stroke', color)
          .attr('d', line)
          .each(function animateEntering () {
            var totalLength = this.getTotalLength();

            d3.select(this)
              .attr('stroke-dasharray',`${totalLength} ${totalLength}`)
              .attr('stroke-dashoffset', totalLength);
          })
          .transition()
          .attr('stroke-dashoffset', 0)
          .each('end', function resetDashArray () {
            d3.select(this).attr('stroke-dasharray', null);
          });

        lineEl.exit()
          .remove();
      });
    }

    line.color = function colorAccessor (_) {
      if (!arguments.length) return color;
      color = _;
      return line;
    };

    line.xValue = function xValueAccessor (_) {
      if (!arguments.length) return xValue;
      xValue = _;
      return line;
    };

    line.yValue = function yValueAccessor (_) {
      if (!arguments.length) return yValue;
      yValue = _;
      return line;
    };

    line.xScale = function xScaleAccessor (_) {
      if (!arguments.length) return xScale;
      xScale = _;
      return line;
    };

    line.yScale = function yScaleAccessor (_) {
      if (!arguments.length) return yScale;
      yScale = _;
      return line;
    };

    line.xComparator = function xComparatorAccessor (_) {
      if (!arguments.length) return xComparator;
      xComparator = _;
      return line;
    };

    return line;
  };
}
