// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from 'inferno';
import HelpTooltip from '../help-tooltip.js';

import tooltipTemplate from './assets/html/tooltip.html!text';

import type {
  $scopeT
} from 'angular';

import type {
  directionsT
} from '../tooltip.js';

export function imlTooltip () {
  'ngInject';

  return {
    scope: {
      toggle: '=?',
      direction: '@',
      size: '<'
    },
    restrict: 'E',
    transclude: true,
    replace: true,
    template: tooltipTemplate,
    link (scope:$scopeT & {in:string}) {
      let deregister = () => {};

      if (scope.hasOwnProperty('toggle'))
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

      scope.$on('$destroy', () => {
        deregister();
        hide();
      });
    }
  };
}

export function helpTooltip () {
  'ngInject';

  return {
    scope: {
      topic: '@',
      direction: '@',
      size: '<'
    },
    restrict: 'E',
    link: function link (scope:{|topic:string, direction:directionsT, size?:string|}, el:HTMLElement[]) {
      scope.size = scope.size || '';
      Inferno.render(
        <HelpTooltip helpKey={scope.topic} direction={scope.direction} size={scope.size} />,
        el[0]
      );
    }
  };
}
