//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@mfl/fp';

export function legendDirective(getLegend) {
  'ngInject';
  return {
    restrict: 'A',
    scope: {
      scale: '='
    },
    require: '^^charter',
    templateNamespace: 'svg',
    link(scope, el, attrs, chartCtrl) {
      const legend = getLegend().colors(scope.scale).showLabels(true);

      const node = el[0];

      const updateLegend = ({ svg, width }) => {
        legend.width(width).height(20).padding(20);

        svg.select(fp.always(node)).call(legend);
      };

      chartCtrl.onUpdate.push(updateLegend);

      legend.dispatch().on('selection', (label, shouldHide) => {
        const obj = {};
        obj[label] = shouldHide;
        chartCtrl.dispatch.event('legend', [obj]);
      });
    }
  };
}
