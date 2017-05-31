//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import _ from 'intel-lodash-mixins';

// $FlowIgnore: HTML templates that flow does not recognize.
import tooltipTemplate from './assets/html/tooltip.html!text';

// $FlowIgnore: HTML templates that flow does not recognize.
import helpTooltipTemplate from './assets/html/help-tooltip.html!text';

export function imlTooltip (position, $timeout, $$rAF, strategies) {
  'ngInject';

  return {
    scope: {
      toggle: '=?',
      direction: '@'
    },
    restrict: 'E',
    transclude: true,
    replace: true,
    template: tooltipTemplate,
    link: function link (scope, jqElement) {
      var deregister;

      var jqPreviousEl = jqElement.prev();

      var positioner = position.positioner(jqElement[0]);

      // look at the parent's previous sibling
      if (!jqPreviousEl.length)
        jqPreviousEl = jqElement.parent().prev();

      if (!jqPreviousEl.length)
        throw new Error('Previous element not found for tooltip!');

      var directions = _.values(position.DIRECTIONS),
        directionsJoined = directions.join(' ');

      directions.splice(directions.indexOf(scope.direction), 1);
      directions.unshift(scope.direction);

      scope.$on('$destroy', function onDestroy () {
        jqPreviousEl = null;
        deregister();
      });

      if (!scope.hasOwnProperty('toggle'))
        deregister = strategies(jqPreviousEl, scope, {
          show: turnThenShow,
          hide: hide
        });
      else
        deregister = scope.$watch('toggle', function (newValue) {
          if (newValue)
            turnThenShow();
          else
            hide();
        }, true);

      scope.$watch(
        function setWatch () {
          return jqElement.html();
        },
        function handleChange (newValue, oldValue) {
          if (newValue !== oldValue)
            $$rAF(recalculate);
        }
      );

      /**
       * Figures out the placement of the popover and applies it to the element's style.
       */
      function recalculate () {
        jqElement.css('min-width', '');
        jqElement.css(position.position(scope.direction, positioner));
      }

      function turnThenShow () {
        $timeout(show);
      }

      function show () {
        setPosition();

        angular.element(position.$window).on('resize', throttledResize);
      }

      function hide () {
        delete scope.in;

        angular.element(position.$window).off('resize', throttledResize);
      }

      var throttledResize = _.throttle(function onThrottle () {
        if (!jqElement.hasClass('in')) return;

        setPosition();
        scope.$digest();
      }, 500);

      /**
       * Sets the position of the tooltip by placing a clone until a match is found.
       */
      function setPosition () {
        var clone = jqElement[0].cloneNode(true),
          jqClone = angular.element(clone),
          clonePosition = position.positioner(clone),
          windowPosition = position.positioner(position.$window);

        jqClone.css('display', 'block');

        // place the clone.
        jqElement.after(clone);

        // check where clone fits.
        directions.some(function (direction) {
          delete scope.in;

          jqClone.removeClass(directionsJoined).addClass(direction);

          var calculatedClonePosition = position.position(direction, clonePosition);

          _.extend(clone.style, calculatedClonePosition);

          var fits = !position.overflows(direction, windowPosition, clonePosition);

          if (fits) {
            scope.placement = direction;
            scope.in = 'in';
            _.extend(jqElement[0].style, calculatedClonePosition);
          }

          return fits;
        });

        //destroy the clone
        jqClone.remove();
        clone = null;
        jqClone = null;
      }
    }
  };
}

export function helpTooltip (help) {
  'ngInject';

  return {
    scope: {
      toggle: '=?',
      topic: '@',
      direction: '@'
    },
    restrict: 'E',
    replace: true,
    template: helpTooltipTemplate,
    link: function link (scope) {
      scope.message = help.get(scope.topic);

      if (scope.hasOwnProperty('toggle'))
        scope.hasToggle = true;
    }
  };
}
