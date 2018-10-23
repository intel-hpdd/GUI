// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { render } from "inferno";
import HelpTooltip from "../help-tooltip.js";
import type { $scopeT } from "angular";

import type { directionsT, sizesT } from "../tooltip.js";

export function imlTooltip() {
  "ngInject";
  return {
    scope: {
      toggle: "=?",
      direction: "@",
      size: "<"
    },
    restrict: "E",
    transclude: true,
    replace: true,
    link(scope: $scopeT & { in: string }) {
      let deregister = () => {};

      if (scope.hasOwnProperty("toggle"))
        deregister = scope.$watch(
          "toggle",
          newValue => {
            if (newValue) show();
            else hide();
          },
          true
        );

      function show() {
        scope.in = "in";
      }

      function hide() {
        delete scope.in;
      }

      scope.$on("$destroy", () => {
        deregister();
        hide();
      });
    },
    template: `<div class="tooltip inferno-tt" ng-class="[direction, in, size]">
  <div class="tooltip-arrow"></div>
  <div class="tooltip-inner" ng-transclude></div>
</div>`
  };
}

export function helpTooltip() {
  "ngInject";
  return {
    scope: {
      topic: "@",
      direction: "@",
      size: "<",
      moreClasses: "<"
    },
    restrict: "E",
    link: function link(
      scope: {| topic: string, direction: directionsT, size?: sizesT, moreClasses: string[] |},
      el: HTMLElement[]
    ) {
      scope.size = scope.size || "";
      scope.moreClasses = scope.moreClasses || [];
      render(
        <HelpTooltip
          helpKey={scope.topic}
          direction={scope.direction}
          size={scope.size}
          moreClasses={scope.moreClasses}
        />,
        el[0]
      );
    }
  };
}
