describe('server detail route', () => {

  var $routeSegmentProvider, GROUPS;

  beforeEach(window.module(() => {
    $routeSegmentProvider = {
      $get: fp.noop,
      when: jasmine.createSpy('$routeSegmentProvider.when'),
      within: jasmine.createSpy('$routeSegmentProvider.within'),
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
    };

    $routeSegmentProvider.when.andReturn($routeSegmentProvider);
    $routeSegmentProvider.within.andReturn($routeSegmentProvider);

    angular.module('route-segment', []).provider({
      $routeSegment: $routeSegmentProvider
    });
  }, 'route-segment', 'serverDetailRoute'));

  beforeEach(inject((_GROUPS_) => {
    GROUPS = _GROUPS_;
  }));

  it('should call when with /configure/server/:id', () => {
    expect($routeSegmentProvider.when).toHaveBeenCalledOnceWith('/configure/server/:id', 'app.serverDetail');
  });

  it('should call within app', () => {
    expect($routeSegmentProvider.within).toHaveBeenCalledOnceWith('app');
  });

  it('should call segment', () => {
    expect($routeSegmentProvider.segment).toHaveBeenCalledOnceWith('serverDetail', {
      controller: 'ServerDetailController',
      controllerAs: 'serverDetail',
      templateUrl: 'iml/server/assets/html/server-detail.html',
      resolve: {
        streams: ['serverDetailResolves', jasmine.any(Function)]
      },
      middleware: ['allowAnonymousReadMiddleware', 'eulaStateMiddleware', 'authenticationMiddleware'],
      untilResolved: {
        templateUrl: 'common/loading/assets/html/loading.html'
      },
      access: GROUPS.FS_ADMINS
    });
  });
});
