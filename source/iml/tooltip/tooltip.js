// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import Inferno from 'inferno';
import InfernoDOM from 'inferno-dom';
import HelpTooltip from '../help-tooltip.js';

import tooltipTemplate from './assets/html/tooltip.html!text';

import type {
  $scopeT
} from 'angular';

import type {
  directionsT
} from '../tooltip.js';

type strategiesT = (jqElement:HTMLElement[], scope:$scopeT, events:Object) => () => mixed;

export function imlTooltip (strategies:strategiesT) {
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
    link (scope:$scopeT & {in:string}, jqElement:HTMLElement[]) {
      let deregister;

      const el = jqElement[0];
      let previousEl = el.previousElementSibling;

      // look at the parent's previous sibling
      if (!previousEl) {
        const parentEl = el.parentNode;

        if (parentEl)
          previousEl = parent.previousElementSibling;
      }

      if (!previousEl)
        throw new Error('Previous element not found for tooltip!');

      scope.$on('$destroy', () => {
        previousEl = null;
        deregister();
      });

      if (!scope.hasOwnProperty('toggle'))
        deregister = strategies(
          angular.element(previousEl),
          scope,
          {
            show,
            hide
          }
        );
      else
        deregister = scope.$watch('toggle', newValue => {
          if (newValue)
            show();
          else
            hide();
        }, true);

      function show () {
        scope.in = 'in';
      }

      function hide () {
        delete scope.in;
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
    link: function link (scope:{|topic:string, direction:directionsT|}, el:HTMLElement[]) {
      InfernoDOM.render(
        <HelpTooltip helpKey={scope.topic} direction={scope.direction} />,
        el[0]
      );
    }
  };
}
