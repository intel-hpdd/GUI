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


export function charterDirective ($window, d3, debounce) {
  'ngInject';

  return {
    restrict: 'A',
    scope: {
      stream: '='
    },
    bindToController: {
      onUpdate: '=?',
      margin: '=?'
    },
    controller: function CharterDirectiveCtrl ($element) {
      /* jshint -W034 */
      'ngInject';

      this.margin = angular.extend({
        top: 30,
        right: 30,
        bottom: 30,
        left: 50
      }, this.margin);

      const el = d3.select($element[0]);
      this.svg = el.select('svg');
      this.getOuterWidth = () => parseInt(el.style('width'), 10);
      this.getOuterHeight = () => parseInt(el.style('height'), 10);
      this.getWidth = () => this.getOuterWidth() - this.margin.left - this.margin.right;
      this.getHeight = () => this.getOuterHeight() - this.margin.top - this.margin.bottom;
      this.dispatch = d3.dispatch('event');

      this.onUpdate = this.onUpdate || [];
    },
    controllerAs: 'ctrl',
    require: 'charter',
    templateNamespace: 'svg',
    transclude: true,
    templateUrl: 'iml/charting/types/chart/assets/html/chart.html',
    link (scope, el, attrs, ctrl) {
      const setDimenstions = fp.flow(
        fp.invokeMethod('attr', ['width', ctrl.getOuterWidth]),
        fp.invokeMethod('attr', ['height', ctrl.getOuterHeight])
      );

      setDimenstions(ctrl.svg);

      scope.stream.each((xs) => {
        ctrl.onUpdate.forEach((update) => update({
          svg: ctrl.svg.datum(xs).transition().duration(2000),
          width: ctrl.getWidth(),
          height: ctrl.getHeight(),
          xs
        }));
      });

      const debounced = debounce(onResize, 100);

      $window
        .addEventListener('resize', debounced);

      function onResize () {
        ctrl.onUpdate.forEach((onChange) => onChange({
          svg: setDimenstions(ctrl.svg).transition().duration(0),
          width: ctrl.getWidth(),
          height: ctrl.getHeight(),
          xs: ctrl.svg.datum()
        }));
      }

      scope.$on('$destroy', () => $window
        .removeEventListener('resize', debounced));
    }
  };
}
