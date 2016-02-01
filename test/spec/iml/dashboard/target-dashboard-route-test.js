import angular from 'angular';
import {noop} from 'intel-fp';

import targetDashboardRouteModule
  from '../../../../source/iml/dashboard/target-dashboard-route-module';

describe('dashboard target route', function () {

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
  }, 'route-segment', targetDashboardRouteModule));

  beforeEach(inject(noop));

  describe('when', function () {
    it('should route to /dashboard/fs/:fsId/MDT/:targetId', function () {
      expect($routeSegmentProvider.when).toHaveBeenCalledOnceWith('/dashboard/fs/:fsId/MDT/:targetId',
        'app.dashboard.target',  { kind: 'MDT' });
    });

    it('should route to /dashboard/server/:serverId/MDT/:targetId', function () {
      expect($routeSegmentProvider.when).toHaveBeenCalledOnceWith('/dashboard/server/:serverId/MDT/:targetId',
        'app.dashboard.target', { kind: 'MDT' });
    });

    it('should route to /dashboard/fs/:fsId/OST/:targetId', function () {
      expect($routeSegmentProvider.when).toHaveBeenCalledOnceWith('/dashboard/fs/:fsId/OST/:targetId',
        'app.dashboard.target', { kind: 'OST' });
    });

    it('should route to /dashboard/server/:serverId/OST/:targetId', function () {
      expect($routeSegmentProvider.when).toHaveBeenCalledOnceWith('/dashboard/server/:serverId/OST/:targetId',
        'app.dashboard.target', { kind: 'OST' });
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
    it('should setup the dashboard target segment', function () {
      expect($routeSegmentProvider.segment).toHaveBeenCalledOnceWith('target', {
        controller: 'TargetDashboardController',
        controllerAs: 'targetDashboard',
        templateUrl: '/static/chroma_ui/source/iml/dashboard/assets/html/target-dashboard.js',
        resolve: {
          kind: ['targetDashboardKind', jasmine.any(Function)],
          charts: ['targetDashboardResolves', jasmine.any(Function)],
          targetStream: ['targetDashboardTargetStream', jasmine.any(Function)],
          usageStream: ['targetDashboardUsageStream', jasmine.any(Function)]
        },
        untilResolved: {
          templateUrl: '/static/chroma_ui/source/iml/loading/assets/html/loading.js'
        },
        dependencies: ['fsId', 'serverId', 'targetId']
      });
    });
  });
});
