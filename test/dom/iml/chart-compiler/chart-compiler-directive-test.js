import chartCompilerModule from '../../../../source/iml/chart-compiler/chart-compiler-module';

describe('chart compiler directive', () => {
  beforeEach(module(chartCompilerModule));

  var $scope, el, spy;

  beforeEach(inject(($rootScope, $compile) => {
    const template = '<div chart-compiler chart="chart"></div>';

    spy = jasmine.createSpy('spy');

    $scope = $rootScope.$new();
    $scope.chart = spy
      .and.returnValue('<div class="tha-chart">I\'m a chart!</div>');

    el = $compile(template)($scope)[0];
    $scope.$apply();
  }));

  it('should add the chart', () => {
    expect(el.querySelector('.tha-chart')).not.toBeNull();
  });

  it('should call the chart with a new scope', () => {
    const $scopeConstructor = Object.getPrototypeOf($scope).constructor;

    expect(spy)
      .toHaveBeenCalledOnceWith(jasmine.any($scopeConstructor));
  });
});
