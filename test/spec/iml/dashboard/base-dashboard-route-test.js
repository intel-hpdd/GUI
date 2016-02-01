import angular from 'angular';
import baseDashboardRouteModule
  from '../../../../source/iml/dashboard/base-dashboard-route-module';


import {noop} from 'intel-fp';

describe('base dashboard route', function () {

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
  }, 'route-segment', baseDashboardRouteModule));

  beforeEach(inject(noop));

  describe('when', function () {
    it('should route to /', function () {
      expect($routeSegmentProvider.when).toHaveBeenCalledOnceWith('/', 'app.dashboard.base');
    });

    it('should route to /dashboard', function () {
      expect($routeSegmentProvider.when).toHaveBeenCalledOnceWith('/dashboard', 'app.dashboard.base');
    });

    it('should route to /dashboard/fs/:fsId', function () {
      expect($routeSegmentProvider.when).toHaveBeenCalledOnceWith('/dashboard/fs/:fsId', 'app.dashboard.base');
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
    it('should setup the dashboard base segment', function () {
      expect($routeSegmentProvider.segment).toHaveBeenCalledOnceWith('base', {
        controller: 'BaseDashboardCtrl',
        controllerAs: 'baseDashboard',
        templateUrl: '/static/chroma_ui/source/iml/dashboard/assets/html/base-dashboard.js',
        resolve: {
          charts: ['baseDashboardChartResolves', jasmine.any(Function)],
          fsStream: ['baseDashboardFsStream', jasmine.any(Function)]
        },
        untilResolved: {
          templateUrl: '/static/chroma_ui/source/iml/loading/assets/html/loading.js'
        },
        dependencies: ['fsId']
      });
    });
  });
});
