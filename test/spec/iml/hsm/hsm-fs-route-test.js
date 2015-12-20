import angular from 'angular';
const {module, inject} = angular.mock;

describe('hsm fs route', () => {
  var $routeSegmentProvider, GROUPS;

  beforeEach(module(() => {
    $routeSegmentProvider = {
      $get: function get () {},
      within: jasmine.createSpy('$routeSegmentProvider.within'),
      when: jasmine.createSpy('$routeSegmentProvider.when'),
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
    };

    $routeSegmentProvider.within.andReturn($routeSegmentProvider);
    $routeSegmentProvider.when.andReturn($routeSegmentProvider);

    angular.module('route-segment', []).provider({
      $routeSegment: $routeSegmentProvider
    });
  }, 'route-segment', 'hsmFsRoute'));

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
        templateUrl: 'iml/hsm/assets/html/hsm-fs.html',
        access: GROUPS.FS_ADMINS,
        resolve: {
          fsStream: ['hsmFsCollStream', jasmine.any(Function)],
          copytoolStream: ['hsmFsCopytoolStream', jasmine.any(Function)]
        },
        middleware: [
          'allowAnonymousReadMiddleware',
          'eulaStateMiddleware',
          'authenticationMiddleware'
        ],
        untilResolved: {
          templateUrl: 'common/loading/assets/html/loading.html'
        }
      });
    });
  });
});
