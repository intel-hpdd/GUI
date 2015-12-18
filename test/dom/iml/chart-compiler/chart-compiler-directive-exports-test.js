describe('chart compiler directive', () => {
  beforeEach(window.module('chartCompiler', 'templates'));

  var $scope, el, spy;

  beforeEach(inject(($rootScope, $compile) => {
    const template = '<div chart-compiler chart="chart"></div>';

    spy = jasmine.createSpy('spy');

    $scope = $rootScope.$new();
    $scope.chart = spy
      .andReturn('<div class="tha-chart">I\'m a chart!</div>');

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
