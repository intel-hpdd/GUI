describe('server route', function () {
  'use strict';

  var $routeSegmentProvider, GROUPS;

  beforeEach(module(function () {
    $routeSegmentProvider = {
      $get: function get () {},
      when: jasmine.createSpy('$routeSegmentProvider.when'),
      within: jasmine.createSpy('$routeSegmentProvider.within'),
      segmentAuthenticated: jasmine.createSpy('$routeSegmentProvider.segmentAuthenticated')
    };

    $routeSegmentProvider.when.andReturn($routeSegmentProvider);
    $routeSegmentProvider.within.andReturn($routeSegmentProvider);

    angular.module('route-segment', []).provider({
      $routeSegment: $routeSegmentProvider
    });
  }, 'route-segment', 'serverRoute'));

  beforeEach(inject(function (_GROUPS_) {
    GROUPS = _GROUPS_;
  }));

  describe('when', function () {
    it('should route to /configure/server', function () {
      expect($routeSegmentProvider.when).toHaveBeenCalledOnceWith('/configure/server',
        'app.server');
    });
  });

  describe('within', function () {
    it('should specify "app"', function () {
      expect($routeSegmentProvider.within).toHaveBeenCalledOnceWith('app');
    });
  });

  describe('segment', function () {
    it('should setup the dashboard target segment', function () {
      expect($routeSegmentProvider.segmentAuthenticated).toHaveBeenCalledOnceWith('server', {
        controller: 'ServerCtrl',
        templateUrl: 'iml/server/assets/html/server.html',
        resolve: {
          streams: ['serverStreamsResolves', jasmine.any(Function)]
        },
        untilResolved: {
          templateUrl: 'common/loading/assets/html/loading.html'
        },
        access: GROUPS.FS_ADMINS
      });
    });
  });
});
