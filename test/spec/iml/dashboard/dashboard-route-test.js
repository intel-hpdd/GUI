import angular from 'angular';
import {noop} from 'intel-fp';

import dashboardRouteModule from '../../../../source/iml/dashboard/dashboard-route-module';

describe('dashboard route', () => {

  var $routeSegmentProvider;

  beforeEach(module(function () {
    $routeSegmentProvider = {
      $get: function get () {},
      within: jasmine.createSpy('$routeSegmentProvider.within'),
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
    };

    $routeSegmentProvider.within.and.returnValue($routeSegmentProvider);

    angular.module('route-segment', []).provider({
      $routeSegment: $routeSegmentProvider
    });
  }, 'route-segment', dashboardRouteModule));

  beforeEach(inject(noop));

  describe('within', function () {
    it('should specify "app"', function () {
      expect($routeSegmentProvider.within).toHaveBeenCalledOnceWith('app');
    });
  });

  describe('segment', function () {
    it('should setup the dashboard segment', function () {
      expect($routeSegmentProvider.segment).toHaveBeenCalledOnceWith('dashboard', {
        controller: 'DashboardCtrl',
        controllerAs: 'dashboard',
        templateUrl: '/static/chroma_ui/source/iml/dashboard/assets/html/dashboard.js',
        resolve: {
          fsStream: ['dashboardFsStream', jasmine.any(Function)],
          hostStream: ['dashboardHostStream', jasmine.any(Function)],
          targetStream: ['dashboardTargetStream', jasmine.any(Function)]
        },
        middleware: ['allowAnonymousReadMiddleware', 'eulaStateMiddleware'],
        untilResolved: {
          templateUrl: '/static/chroma_ui/source/iml/loading/assets/html/loading.js'
        }
      });
    });
  });
});
