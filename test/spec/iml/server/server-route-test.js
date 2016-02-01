import angular from 'angular';
import serverRouteModule from '../../../../source/iml/server/server-route-module';

describe('server route', () => {
  var $routeSegmentProvider, GROUPS;

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
  }, 'route-segment', serverRouteModule));

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
      expect($routeSegmentProvider.segment).toHaveBeenCalledOnceWith('server', {
        controller: 'ServerCtrl',
        templateUrl: '/static/chroma_ui/source/iml/server/assets/html/server.js',
        resolve: {
          streams: ['serverResolves', jasmine.any(Function)]
        },
        middleware: ['allowAnonymousReadMiddleware', 'eulaStateMiddleware', 'authenticationMiddleware'],
        untilResolved: {
          templateUrl: '/static/chroma_ui/source/iml/loading/assets/html/loading.js'
        },
        access: GROUPS.FS_ADMINS
      });
    });
  });
});
