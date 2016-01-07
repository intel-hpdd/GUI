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

import angular from 'angular/angular';
import {noop} from 'intel-fp/fp';

export default function baseChartFactory ($window, nv, d3, documentHidden, documentVisible) {
  'ngInject';

  return function baseChart (overrides) {
    var defaultDirective = {
      restrict: 'E',
      require: '^?fullScreen',
      replace: true,
      scope: {
        stream: '=',
        options: '='
      },
      templateUrl: 'iml/charts/assets/html/chart.html',
      link: function link (scope, element, attrs, fullScreenCtrl) {
        if (fullScreenCtrl) fullScreenCtrl.addListener(setChartViewBox);

        var svg = d3.select(element[0].querySelector('svg'));
        var chart = config.generateChart(nv);
        var render = createRenderer(svg, chart);

        svg
          .attr('preserveAspectRatio', 'xMinYMid')
          .attr('width', '100%')
          .attr('height', '100%');

        var throttled = _.throttle(setChartViewBox, 500);

        $window.addEventListener('resize', throttled);

        if (scope.options && scope.options.setup)
          scope.options.setup(chart, d3, nv);

        const toggleNoData = (xs) => {
          if (xs === documentHidden) {
            if (chart.noData)
              chart.noData('Fetching new data...');

            return [];
          } else if (xs === documentVisible) {
            return [];
          }

          if (chart.noData)
            chart.noData('No Data Available.');

          return xs;
        };

        scope.stream
          .map(toggleNoData)
          .each(renderData);

        setChartViewBox();

        function renderData (v) {
          var oldData = svg.datum() || [];

          // Pull the state nvd3 stores and push back to our raw val.
          oldData.forEach(function copyStateRefs (item) {
            if (Array.isArray(item))
              return;

            var propsToCopy = _.omit(item, ['values', 'key']);
            var series = _.find(v, { key: item.key });

            if (series)
              angular.extend(series, propsToCopy);
          });

          svg.datum(v);

          config.onUpdate(chart, v);

          if (scope.options && scope.options.beforeUpdate)
            scope.options.beforeUpdate(chart);

          render();

          config.afterUpdate(chart);
        }

        /**
         * Sets the viewBox of the chart to the current container width and height
         */
        function setChartViewBox () {
          var rect = element[0]
            .getBoundingClientRect();

          svg
            .attr('viewBox', '0 0 ' + rect.width + ' ' + rect.height)
            .transition()
            .duration(50)
            .call(chart);
        }

        var deregister = scope.$watch('stream', function watcher (newVal, oldVal) {
          if (newVal === oldVal) return;

          chart.noData('Fetching new data...');
          svg.datum([]);

          render();

          newVal
            .map(toggleNoData)
            .each(renderData);
        });

        scope.$on('$destroy', function onDestroy () {
          deregister();

          $window.removeEventListener('resize', throttled, false);

          if (fullScreenCtrl)
            fullScreenCtrl
              .removeListener(setChartViewBox);

          if (chart.destroy)
            chart.destroy();

          chart = null;

          svg.remove();
          svg = null;
        });
      }
    };

    var config = {
      directive: defaultDirective,
      generateChart: function generateChart () {
        throw new Error('config::generateChart must be overriden.');
      },
      afterUpdate: noop,
      onUpdate: noop
    };

    angular.merge(config, overrides);

    return config.directive;
  };

  function createRenderer (svg, chart) {
    return function render () {
      if (chart.update)
        chart.update();
      else
        svg.call(chart);
    };
  }
}
