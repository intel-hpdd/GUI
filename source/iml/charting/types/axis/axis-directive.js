//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';

export function axisDirective (d3) {
  'ngInject';

  return {
    restrict: 'A',
    scope: {
      scale: '=',
      orient: '='
    },
    require: '^^charter',
    templateNamespace: 'svg',
    template: '<g class="axis"></g>',
    link (scope, el, attrs, chartCtrl) {
      const axis = d3.svg.axis()
        .scale(scope.scale)
        .orient(scope.orient);

      const translateBottom = (a) => a.attr('transform', `translate(0,${chartCtrl.getHeight() - 20})`);

      const translate = fp.cond(
        [fp.eq('bottom'), fp.always(translateBottom)],
        [fp.always(true), fp.always(fp.identity)]
      );

      const axisEl = d3.select(el[0])
        .select('.axis')
        .call(translate(scope.orient));

      const updateAxis = ({svg}) => svg.each(() => {
        axisEl
          .transition()
          .call(axis);
      });

      chartCtrl.onUpdate.push(updateAxis);
    }
  };
}
