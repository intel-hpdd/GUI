import angular from 'angular';
import hsmFsRouteModule from
  '../../../../source/iml/hsm/hsm-fs-route-module';

describe('hsm fs route', () => {
  var $routeSegmentProvider, GROUPS;

  beforeEach(module(() => {
    $routeSegmentProvider = {
      $get: function get () {},
      within: jasmine.createSpy('$routeSegmentProvider.within'),
      when: jasmine.createSpy('$routeSegmentProvider.when'),
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
    };

    $routeSegmentProvider.within.and.returnValue($routeSegmentProvider);
    $routeSegmentProvider.when.and.returnValue($routeSegmentProvider);

    angular.module('route-segment', []).provider({
      $routeSegment: $routeSegmentProvider
    });
  }, 'route-segment', hsmFsRouteModule));

  beforeEach(inject((_GROUPS_) => {
    GROUPS = _GROUPS_;
  }));

  describe('when', () => {
    it('/configure/hsm/:fsId?', () => {
      expect($routeSegmentProvider.when).toHaveBeenCalledOnceWith('/configure/hsm/:fsId?',
        'app.hsmFs.hsm');
    });
  });

  describe('within', () => {
    it('should specify "app"', () => {
      expect($routeSegmentProvider.within).toHaveBeenCalledOnceWith('app');
    });
  });

  describe('segment', () => {
    it('should setup the hsm segment', () => {
      expect($routeSegmentProvider.segment).toHaveBeenCalledOnceWith('hsmFs', {
        controller: 'HsmFsCtrl',
        controllerAs: 'hsmFs',
        templateUrl: '/static/chroma_ui/source/iml/hsm/assets/html/hsm-fs.js',
        access: GROUPS.FS_ADMINS,
        resolve: {
          fsStream: jasmine.any(Function)
        },
        middleware: [
          'allowAnonymousReadMiddleware',
          'eulaStateMiddleware',
          'authenticationMiddleware'
        ],
        untilResolved: {
          templateUrl: '/static/chroma_ui/source/iml/loading/assets/html/loading.js'
        }
      });
    });
  });
});
