import angular from 'angular';
import {noop} from 'intel-fp';

import serverDashboardRouteModule from '../../../../source/iml/dashboard/server-dashboard-route-module';

describe('dashboard server route', () => {
  var $routeSegmentProvider;

  beforeEach(module(function () {
    $routeSegmentProvider = {
      $get: function get () {},
      when: jasmine.createSpy('$routeSegmentProvider.when'),
      within: jasmine.createSpy('$routeSegmentProvider.within'),
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
    };

    $routeSegmentProvider.when.and.returnValue($routeSegmentProvider);
    $routeSegmentProvider.within.and.returnValue($routeSegmentProvider);

    angular.module('route-segment', []).provider({
      $routeSegment: $routeSegmentProvider
    });
  }, 'route-segment', serverDashboardRouteModule));

  beforeEach(inject(noop));

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
        templateUrl: '/static/chroma_ui/source/iml/dashboard/assets/html/server-dashboard.js',
        resolve: {
          charts: ['serverDashboardChartResolves', jasmine.any(Function)],
          hostStream: ['serverDashboardHostStreamResolves', jasmine.any(Function)]
        },
        untilResolved: {
          templateUrl: '/static/chroma_ui/source/iml/loading/assets/html/loading.js'
        },
        dependencies: ['serverId']
      });
    });
  });
});
