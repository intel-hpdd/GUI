//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import debounce from "@iml/debounce";
import d3 from "d3";

export function charterDirective($window) {
  "ngInject";
  return {
    restrict: "A",
    scope: {
      stream: "="
    },
    bindToController: {
      onUpdate: "=?",
      margin: "=?"
    },
    controller: function CharterDirectiveCtrl($element) {
      /* jshint -W034 */
      "ngInject";
      this.margin = Object.assign(
        {
          top: 30,
          right: 30,
          bottom: 30,
          left: 50
        },
        this.margin
      );

      const el = d3.select($element[0]);
      this.svg = el.select("svg");
      this.getOuterWidth = () => parseInt(el.style("width"), 10);
      this.getOuterHeight = () => parseInt(el.style("height"), 10);
      this.getWidth = () => this.getOuterWidth() - this.margin.left - this.margin.right;
      this.getHeight = () => this.getOuterHeight() - this.margin.top - this.margin.bottom;
      this.dispatch = d3.dispatch("event");

      this.onUpdate = this.onUpdate || [];
    },
    controllerAs: "ctrl",
    require: "charter",
    templateNamespace: "svg",
    transclude: true,
    template: `<svg class="charting">
  <g ng-attr-transform="translate({{ ctrl.margin.left }},{{ ctrl.margin.top }})" ng-transclude></g>
</svg>`,
    link(scope, el, attrs, ctrl) {
      const setDimensions = x => {
        x.attr("width", ctrl.getOuterWidth());
        x.attr("height", ctrl.getOuterHeight());

        return x;
      };

      setDimensions(ctrl.svg);

      scope.stream.each(xs => {
        ctrl.onUpdate.forEach(update => {
          if (!document.body.contains(ctrl.svg[0][0])) return;

          update({
            svg: ctrl.svg
              .datum(xs)
              .transition()
              .duration(2000),
            width: ctrl.getWidth(),
            height: ctrl.getHeight(),
            xs
          });
        });
      });

      const debounced = debounce(onResize, 100);

      $window.addEventListener("resize", debounced);

      function onResize() {
        ctrl.onUpdate.forEach(onChange =>
          onChange({
            svg: setDimensions(ctrl.svg)
              .transition()
              .duration(0),
            width: ctrl.getWidth(),
            height: ctrl.getHeight(),
            xs: ctrl.svg.datum()
          })
        );
      }

      scope.$on("$destroy", () => $window.removeEventListener("resize", debounced));
    }
  };
}
