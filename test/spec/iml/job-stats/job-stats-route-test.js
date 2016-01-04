import angular from 'angular';
const {module, inject} = angular.mock;

import {noop} from 'intel-fp/fp';

describe('job stats route', function () {

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
  }, 'route-segment', 'jobStatsRoute'));

  beforeEach(inject(noop));

  describe('when', function () {
    it('should route to /dashboard/jobstats/:id/:startDate/:endDate', function () {
      expect($routeSegmentProvider.when).toHaveBeenCalledOnceWith('/dashboard/jobstats/:id/:startDate/:endDate',
        'app.jobstats');
    });
  });

  describe('within', function () {
    it('should specify "app"', function () {
      expect($routeSegmentProvider.within).toHaveBeenCalledOnceWith('app');
    });
  });

  describe('segment', function () {
    it('should setup the dashboard segment', function () {
      expect($routeSegmentProvider.segment).toHaveBeenCalledOnceWith('jobstats', {
        controller: 'JobStatsCtrl',
        controllerAs: 'jobStats',
        templateUrl: 'iml/job-stats/assets/html/job-stats.html',
        resolve: {
          target: ['appJobstatsTarget', jasmine.any(Function)],
          metrics: ['appJobstatsMetrics', jasmine.any(Function)]
        },
        middleware: ['allowAnonymousReadMiddleware', 'eulaStateMiddleware'],
        untilResolved: {
          templateUrl: 'common/loading/assets/html/loading.html'
        }
      });
    });
  });
});
