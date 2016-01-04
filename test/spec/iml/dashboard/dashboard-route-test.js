import angular from 'angular';
const {module, inject} = angular.mock;

import {noop} from 'intel-fp/fp';

describe('dashboard route', function () {

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
  }, 'route-segment', 'dashboardRoute'));

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
        templateUrl: 'iml/dashboard/assets/html/dashboard.html',
        resolve: {
          fsStream: ['dashboardFsStream', jasmine.any(Function)],
          hostStream: ['dashboardHostStream', jasmine.any(Function)],
          targetStream: ['dashboardTargetStream', jasmine.any(Function)]
        },
        middleware: ['allowAnonymousReadMiddleware', 'eulaStateMiddleware'],
        untilResolved: {
          templateUrl: 'common/loading/assets/html/loading.html'
        }
      });
    });
  });
});
