import dashboardModule from '../../../../source/iml/dashboard/dashboard-module';

describe('charts container', () => {
  beforeEach(module(dashboardModule));

  let $scope, el, spy;

  beforeEach(
    inject(($rootScope, $compile) => {
      const template = '<charts-container charts="charts"></charts-container>';

      spy = jasmine.createSpy('spy');

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

    expect(spy).toHaveBeenCalledOnceWith(
      expect.any($scopeConstructor),
      'stream'
    );
  });
});
