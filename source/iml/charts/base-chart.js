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

import angular from 'angular';
import d3 from 'd3';
import nv from 'nvd3';
import global from '../global.js';


import _ from 'intel-lodash-mixins';

import {
  noop
} from 'intel-fp';

// $FlowIgnore: HTML templates that flow does not recognize.
import chartTemplate from './assets/html/chart.html!text';

import {
  documentHidden,
  documentVisible
} from '../stream-when-visible/stream-when-visible.js';

export default function baseChart (overrides) {
  var defaultDirective = {
    restrict: 'E',
    require: ['^?fullScreen', '^rootPanel'],
    replace: true,
    scope: {
      stream: '=',
      options: '='
    },
    template: chartTemplate,
    link (scope, element, attrs, ctrls) {
      const [fullScreenCtrl, rootPanelCtrl] = ctrls;

      var svg = d3.select(element[0].querySelector('svg'));
      var chart = config.generateChart(nv);
      const render = createRenderer(svg, chart);
      const renderNoTransition = () => {
        let oldD = chart.duration();
        chart.duration(0);

        render();

        chart.duration(oldD);
      };

      if (fullScreenCtrl)
        fullScreenCtrl.addListener(renderNoTransition);

      svg
        .attr('width', '100%')
        .attr('height', '100%');

      const throttled = _.throttle(renderNoTransition, 500);


      rootPanelCtrl.register(throttled);
      global.addEventListener('resize', throttled);

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

      render();

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

        svg
          .datum(v);

        config.onUpdate(chart, v);

        if (scope.options && scope.options.beforeUpdate)
          scope.options.beforeUpdate(chart);

        render();

        config.afterUpdate(chart);
      }

      scope.$on('$destroy', function onDestroy () {
        rootPanelCtrl.deregister(throttled);
        global.removeEventListener('resize', throttled, false);

        if (fullScreenCtrl)
          fullScreenCtrl
            .removeListener(renderNoTransition);

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
    generateChart () {
      throw new Error('config::generateChart must be overriden.');
    },
    afterUpdate: noop,
    onUpdate: noop
  };

  angular.merge(config, overrides);

  return config.directive;
}

function createRenderer (svg, chart) {
  return function render () {
    if (!document.body.contains(svg[0][0]))
      return;

    if (chart.update)
      chart.update();
    else
      svg.call(chart);
  };
}
