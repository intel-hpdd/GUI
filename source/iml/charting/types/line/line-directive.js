//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import getLine from "./get-line.js";

export function lineDirective() {
  "ngInject";
  return {
    restrict: "A",
    scope: {
      color: "=",
      scaleX: "=",
      scaleY: "=",
      valueX: "=",
      valueY: "=",
      comparatorX: "="
    },
    require: "^^charter",
    templateNamespace: "svg",
    link(scope, el, attrs, chartCtrl) {
      const node = el[0];
      const line = getLine();

      const callLine = fp.flow(
        x => x.select(fp.always(node)),
        x => x.call(line)
      );

      chartCtrl.dispatch.on(`event.line${line.getCount()}`, (type, args) => {
        if (type !== "legend") return;

        const shouldHide = scope.valueY(args[0]);

        if (shouldHide == null) return;

        line.opacity(shouldHide ? 0 : 1);

        callLine(chartCtrl.svg);
      });

      const updateLine = ({ svg }) => {
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
