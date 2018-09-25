//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from "angular";

export default (position, $timeout, $window, $compile) => {
  "ngInject";
  const template =
    '<div class="popover fade {{ placement }}" ng-class="{in: open}">\
  <div class="arrow"></div>\
  <h3 class="popover-title" ng-bind="title" ng-show="title"></h3>\
  <div class="popover-content"></div>\
  </div>';

  return {
    restrict: "E",
    transclude: true,
    scope: {
      placement: "@",
      title: "@",
      work: "&",
      onToggle: "&"
    },
    link: function link(scope, el, attrs, ctrl, $transclude) {
      let popoverLinker = $compile(template);

      let popoverButton = angular.element(
        Array.from(el[0].parentNode.children).filter(x => x.classList.contains("activate-popover"))[0]
      );

      let wrappedWindow = angular.element($window);

      if (!popoverButton) throw new Error("No popover button found.");

      scope.open = false;

      scope.work({
        actions: {
          hide: hide,
          recalculate: recalculate
        }
      });

      popoverButton.on("click", function handleClick($event) {
        // Close any other popovers that are currently open
        if (!scope.open) document.body.click();

        toggle($event);
        scope.$digest();
      });

      scope.$on("$destroy", function onDestroy() {
        popoverButton.off("click");
        wrappedWindow.off("click", digestAndHide);
        wrappedWindow = popoverButton = popoverLinker = null;

        destroyPopover();
      });

      let inheritedScope, popoverEl, positioner;
      function createPopover() {
        $transclude(function createNewPopover(clone, transcludedScope) {
          inheritedScope = transcludedScope;

          popoverEl = popoverLinker(scope, angular.noop);

          positioner = position.positioner(popoverEl[0]);

          angular.element(popoverEl[0].querySelector(".popover-content")).append(clone);

          popoverEl.on("click", function handleClick($event) {
            $event.stopPropagation();
          });

          el[0].parentElement.insertBefore(popoverEl[0], el[0]);

          scope.onToggle({
            state: "opened"
          });

          $timeout(
            function showAndRecalculate() {
              transcludedScope.$parent.$digest();
              popoverEl.css("display", "block");

              if (scope.placement) recalculate();

              scope.open = true;
              scope.$digest();
            },
            0,
            false
          );
        });
      }

      function destroyPopover() {
        scope.onToggle({
          state: "closed"
        });

        if (popoverEl) {
          popoverEl.off("click");
          popoverEl.remove();
          popoverEl = null;
        }

        if (inheritedScope) {
          inheritedScope.$destroy();
          inheritedScope = null;
        }
      }

      /**
       * Toggles the visibility of the popover. Used as an event callback.
       * @param {object} $event
       */
      function toggle($event) {
        $event.stopPropagation();

        if (scope.open) {
          hide();
        } else {
          createPopover();
          wrappedWindow.on("click", digestAndHide);
        }
      }

      function digestAndHide() {
        hide();
        scope.$digest();
      }

      /**
       * destroys the popover and unbinds the window click listener.
       */
      function hide() {
        scope.open = false;

        $timeout(destroyPopover, 500);

        wrappedWindow.off("click", digestAndHide);
      }

      /**
       * Figures out the placement of the popover and applies it to the element's style.
       */
      function recalculate() {
        if (!popoverEl) return;

        popoverEl.css("min-width", "");
        popoverEl.css(position.position(scope.placement, positioner));
      }
    }
  };
};
