import angular from 'angular';
const {module, inject} = angular.mock;

describe('dashboard server route', function () {

  var $routeSegmentProvider;

  beforeEach(module(function () {
    $routeSegmentProvider = {
      $get: function get () {},
      when: jasmine.createSpy('$routeSegmentProvider.when'),
      within: jasmine.createSpy('$routeSegmentProvider.within'),
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
    };

    $routeSegmentProvider.when.andReturn($routeSegmentProvider);
    $routeSegmentProvider.within.andReturn($routeSegmentProvider);

    angular.module('route-segment', []).provider({
      $routeSegment: $routeSegmentProvider
    });
  }, 'route-segment', 'serverDashboardRoute'));

  beforeEach(inject(fp.noop));

  describe('when', function () {
    it('should route to /dashboard/server/:serverId', function () {
      expect($routeSegmentProvider.when)
        .toHaveBeenCalledOnceWith('/dashboard/server/:serverId', 'app.dashboard.server');
    });
  });

  describe('within', function () {
    it('should specify "app"', function () {
      expect($routeSegmentProvider.within).toHaveBeenCalledOnceWith('app');
    });

    it('should specify "dashboard"', function () {
      expect($routeSegmentProvider.within).toHaveBeenCalledOnceWith('dashboard');
    });
  });

  describe('segment', function () {
    it('should setup the dashboard server segment', function () {
      expect($routeSegmentProvider.segment).toHaveBeenCalledOnceWith('server', {
        controller: 'ServerDashboardCtrl',
        controllerAs: 'serverDashboard',
        templateUrl: 'iml/dashboard/assets/html/server-dashboard.html',
        resolve: {
          charts: ['serverDashboardChartResolves', jasmine.any(Function)],
          hostStream: ['serverDashboardHostStreamResolves', jasmine.any(Function)]
        },
        untilResolved: {
          templateUrl: 'common/loading/assets/html/loading.html'
        },
        dependencies: ['serverId']
      });
    });
  });
});
