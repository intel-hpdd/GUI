//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';

export function lineDirective (getLine) {
  'ngInject';

  return {
    restrict: 'A',
    scope: {
      color: '=',
      scaleX: '=',
      scaleY: '=',
      valueX: '=',
      valueY: '=',
      comparatorX: '='
    },
    require: '^^charter',
    templateNamespace: 'svg',
    link (scope, el, attrs, chartCtrl) {
      const node = el[0];
      const line = getLine();

      const callLine = fp.flow(
        fp.invokeMethod('select', [fp.always(node)]),
        fp.invokeMethod('call', [line])
      );

      chartCtrl.dispatch.on(`event.line${line.getCount()}`, (type, args) => {
        if (type !== 'legend')
          return;

        const shouldHide = scope.valueY(args[0]);

        if (shouldHide == null)
          return;

        line
          .opacity(shouldHide ? 0 : 1);

        callLine(chartCtrl.svg);
      });

      const updateLine = ({svg}) => {
        line
          .color(scope.color)
          .xScale(scope.scaleX)
          .yScale(scope.scaleY)
          .xValue(scope.valueX)
          .xComparator(scope.comparatorX)
          .yValue(scope.valueY);

        callLine(svg);
      };

      chartCtrl.onUpdate.push(updateLine);
    }
  };
}
