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

angular.module('hsm')
  .directive('agentVsCopytool', function (d3, getLine) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        stream: '='
      },
      templateUrl: 'iml/hsm/assets/html/agent-vs-copytool.html',
      link: function link (scope, $element) {
        function debounce (func, wait, immediate) {
          var timeout;
          return function debounceTick () {
            var context = this, args = arguments;
            var later = function debounceLater () {
              timeout = null;
              if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
          };
        }

        d3.select(window).on('resize', debounce(function onResize () {
          var outerWidth = parseInt(hsmChart.style('width'), 10);
          var width = outerWidth - margin.left - margin.right;
          d3.select('svg').attr('width', outerWidth);
          x.range([0, width]);

          svg
            .select('.x.axis')
            .transition()
            .call(xAxis);

          svg
            .transition()
            .call(waitingRequestsLine)
            .call(runningActionsLine)
            .call(idleWorkersLine);
        }, 100, true));

        var x = d3.time.scale.utc();
        var y = d3.scale.linear();

        var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom');

        var yAxis = d3.svg.axis()
          .scale(y)
          .tickFormat(d3.format('d'))
          .orient('left');

        function getDate (d) {
          return new Date(d.ts);
        }

        var getTime = fp.invokeMethod('getTime', []);
        var xComparator = fp.eqFn(getTime, getTime);

        var hsmChart = d3.select($element[0]);

        var outerWidth = parseInt(hsmChart.style('width'), 10);
        var outerHeight = parseInt(hsmChart.style('height'), 10);
        var margin = {
          top: 30,
          right: 30,
          bottom: 30,
          left: 30
        };
        var width = outerWidth - margin.left - margin.right;
        var height = outerHeight - margin.top - margin.bottom;

        x.range([0, width]);
        y.range([height, 0]);

        var svg = hsmChart
          .append('svg')
          .attr('class', 'new-chart')
          .attr('width', outerWidth)
          .attr('height', outerHeight)
          .append('g')
          .attr('transform', 'translate(%s,%s)'.sprintf(margin.left, margin.top));

        svg.append('g')
          .attr('class', 'y axis');

        svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,%s)'.sprintf(height));

        var runningActionsLine = getLine()
          .color('#F3B600')
          .xScale(x)
          .yScale(y)
          .xValue(getDate)
          .xComparator(xComparator)
          .yValue(fp.lensProp('running actions'));

        var waitingRequestsLine = getLine()
          .color('#A3B600')
          .xScale(x)
          .yScale(y)
          .xValue(getDate)
          .xComparator(xComparator)
          .yValue(fp.lensProp('waiting requests'));

        var idleWorkersLine = getLine()
          .color('#0067B4')
          .xScale(x)
          .yScale(y)
          .xValue(getDate)
          .xComparator(xComparator)
          .yValue(fp.lensProp('idle workers'));

        var getNumbers = fp.flow(_.fomit('ts'), _.values);

        scope.stream.each(function renderData (v) {
          var max = _.flatten(fp.map(getNumbers, v));

          x.domain(d3.extent(v, getDate));
          y.domain([0, d3.max(max) + 10]);

          var s = svg
            .datum(v)
            .transition()
            .duration(1000)
            .ease('linear');

           s
            .call(runningActionsLine)
            .call(waitingRequestsLine)
            .call(idleWorkersLine);

          s.select('.y.axis')
            .call(yAxis);

          s.select('.x.axis')
            .call(xAxis);
        });
      }
    };
});
