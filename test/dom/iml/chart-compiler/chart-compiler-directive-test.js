import { chartCompilerDirective } from '../../../../source/iml/chart-compiler/chart-compiler-directive.js';
import angular from '../../../angular-mock-setup.js';

describe('chart compiler directive', () => {
  beforeEach(
    angular.mock.module($compileProvider => {
      $compileProvider.directive('chartCompiler', chartCompilerDirective);
    })
  );

  let $scope, el, spy;
  beforeEach(
    angular.mock.inject(($rootScope, $compile) => {
      const template = '<div chart-compiler chart="chart"></div>';
      spy = jest.fn();
      $scope = $rootScope.$new();
      $scope.chart = {
        template: '<div class="tha-chart">I\'m a chart!</div>',
        stream: 'stream',
        chartFn: spy.mockReturnValue()
      };
      el = $compile(template)($scope)[0];
      $scope.$apply();
    })
  );
  it('should add the chart', () => {
    expect(el.querySelector('.tha-chart')).not.toBeNull();
  });
  it('should call the chart with scope and stream', () => {
    const $scopeConstructor = Object.getPrototypeOf($scope).constructor;
    expect(spy).toHaveBeenCalledOnceWith(
      expect.any($scopeConstructor),
      'stream'
    );
  });
});
