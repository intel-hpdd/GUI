describe('charts container', function () {
  'use strict';

  beforeEach(module('dashboard', 'templates'));

  var $scope, el, spy;

  beforeEach(inject(function ($rootScope, $compile) {
    var template = '<charts-container charts="charts"></charts-container>';

    spy = jasmine.createSpy('spy');

    $scope = $rootScope.$new();
    $scope.charts = [spy];

    el = $compile(template)($scope)[0];
  }));

  it('should add a dashboard row wrapper', function () {
    expect(el.querySelector('.row.dashboard')).toBeTruthy();
  });

  it('should add a chart wrapper', function () {
    expect(el.querySelectorAll('.dashboard-chart').length).toBe(1);
  });

  it('should call the chart with scope and the element', function () {
    var $constructor = Object.getPrototypeOf($('')).constructor;
    var $scopeConstructor = Object.getPrototypeOf($scope).constructor;

    expect(spy).toHaveBeenCalledOnceWith(
      jasmine.any($scopeConstructor),
      jasmine.any($constructor)
    );
  });
});
