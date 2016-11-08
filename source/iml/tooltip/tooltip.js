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
import _ from 'intel-lodash-mixins';
import Inferno from 'inferno';
import InfernoDOM from 'inferno-dom';
import HelpTooltip from '../help-tooltip.js';

import tooltipTemplate from './assets/html/tooltip.html!text';

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
      let deregister;

      let jqPreviousEl = jqElement.prev();

      const positioner = position.positioner(jqElement[0]);

      // look at the parent's previous sibling
      if (!jqPreviousEl.length)
        jqPreviousEl = jqElement.parent().prev();

      if (!jqPreviousEl.length)
        throw new Error('Previous element not found for tooltip!');

      const directions = _.values(position.DIRECTIONS);
      const directionsJoined = directions.join(' ');

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

      const throttledResize = _.throttle(function onThrottle () {
        if (!jqElement.hasClass('in')) return;

        setPosition();
        scope.$digest();
      }, 500);

      /**
       * Sets the position of the tooltip by placing a clone until a match is found.
       */
      function setPosition () {
        let clone = jqElement[0].cloneNode(true);
        let jqClone = angular.element(clone);

        const clonePosition = position.positioner(clone);
        const windowPosition = position.positioner(position.$window);

        jqClone.css('display', 'block');

        // place the clone.
        jqElement.after(clone);

        // check where clone fits.
        directions.some(function (direction) {
          delete scope.in;

          jqClone.removeClass(directionsJoined).addClass(direction);

          const calculatedClonePosition = position.position(direction, clonePosition);

          _.extend(clone.style, calculatedClonePosition);

          const fits = !position.overflows(direction, windowPosition, clonePosition);

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

export function helpTooltip () {
  'ngInject';

  return {
    scope: {
      topic: '@',
      direction: '@'
    },
    restrict: 'E',
    link: function link (scope, el) {
      InfernoDOM.render(
        <HelpTooltip helpKey={scope.topic} direction={scope.direction} />,
        el[0]
      );
    }
  };
}
