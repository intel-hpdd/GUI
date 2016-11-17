// @flow

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

import Inferno from 'inferno';
import HelpTooltip from '../help-tooltip.js';

import tooltipTemplate from './assets/html/tooltip.html!text';

import type {
  $scopeT
} from 'angular';

import type {
  directionsT,
  sizesT
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
    link: function link (scope:{|topic:string, direction:directionsT, size?:sizesT|}, el:HTMLElement[]) {
      scope.size = scope.size || '';
      Inferno.render(
        <HelpTooltip helpKey={scope.topic} direction={scope.direction} size={scope.size} />,
        el[0]
      );
    }
  };
}
