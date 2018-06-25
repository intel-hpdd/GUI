import { chartsContainer } from '../../../../source/iml/dashboard/charts-container-directive.js';
import { chartCompilerDirective } from '../../../../source/iml/chart-compiler/chart-compiler-directive.js';

import angular from '../../../angular-mock-setup.js';

describe('charts container', () => {
  beforeEach(
    angular.mock.module($compileProvider => {
      $compileProvider.directive('chartCompiler', chartCompilerDirective).directive('chartsContainer', chartsContainer);
    })
  );

  let $scope, el, spy;

  beforeEach(
    angular.mock.inject(($rootScope, $compile) => {
      const template = '<charts-container charts="charts"></charts-container>';

      spy = jest.fn();

      $scope = $rootScope.$new();
      $scope.charts = [
        {
          template: '<foo></foo>',
          stream: 'stream',
          chartFn: spy
        }
      ];

      el = $compile(template)($scope)[0];
      $scope.$apply();
    })
  );

  it('should add a dashboard row wrapper', () => {
    expect(el.querySelector('.row.dashboard')).toBeTruthy();
  });

  it('should add a chart wrapper', () => {
    expect(el.querySelectorAll('.dashboard-chart').length).toBe(1);
  });

  it('should call the chart with a new scope', () => {
    const $scopeConstructor = Object.getPrototypeOf($scope).constructor;

    expect(spy).toHaveBeenCalledOnceWith(expect.any($scopeConstructor), 'stream');
  });
});
