//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import * as fp from 'intel-fp';
import charterTemplate from './assets/html/chart.html!text';

export function charterDirective($window, d3, debounce) {
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
    controller: function CharterDirectiveCtrl($element) {
      /* jshint -W034 */
      'ngInject';
      this.margin = angular.extend(
        {
          top: 30,
          right: 30,
          bottom: 30,
          left: 50
        },
        this.margin
      );

      const el = d3.select($element[0]);
      this.svg = el.select('svg');
      this.getOuterWidth = () => parseInt(el.style('width'), 10);
      this.getOuterHeight = () => parseInt(el.style('height'), 10);
      this.getWidth = () =>
        this.getOuterWidth() - this.margin.left - this.margin.right;
      this.getHeight = () =>
        this.getOuterHeight() - this.margin.top - this.margin.bottom;
      this.dispatch = d3.dispatch('event');

      this.onUpdate = this.onUpdate || [];
    },
    controllerAs: 'ctrl',
    require: 'charter',
    templateNamespace: 'svg',
    transclude: true,
    template: charterTemplate,
    link(scope, el, attrs, ctrl) {
      const setDimenstions = fp.flow(
        fp.invokeMethod('attr', ['width', ctrl.getOuterWidth]),
        fp.invokeMethod('attr', ['height', ctrl.getOuterHeight])
      );

      setDimenstions(ctrl.svg);

      scope.stream.each(xs => {
        ctrl.onUpdate.forEach(update => {
          if (!document.body.contains(ctrl.svg[0][0])) return;

          update({
            svg: ctrl.svg.datum(xs).transition().duration(2000),
            width: ctrl.getWidth(),
            height: ctrl.getHeight(),
            xs
          });
        });
      });

      const debounced = debounce(onResize, 100);

      $window.addEventListener('resize', debounced);

      function onResize() {
        ctrl.onUpdate.forEach(onChange =>
          onChange({
            svg: setDimenstions(ctrl.svg).transition().duration(0),
            width: ctrl.getWidth(),
            height: ctrl.getHeight(),
            xs: ctrl.svg.datum()
          }));
      }

      scope.$on('$destroy', () =>
        $window.removeEventListener('resize', debounced));
    }
  };
}
