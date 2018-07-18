//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';

export const chartCompilerDirective = $compile => {
  'ngInject';
  return {
    scope: {
      chart: '='
    },
    link(scope, el) {
      const template = angular.element(scope.chart.template)[0];
      el[0].appendChild(template);

      const childScope = scope.$new();
      childScope.chart = scope.chart.chartFn(childScope, scope.chart.stream);
      $compile(template)(childScope);
    }
  };
};
