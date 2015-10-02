describe('server detail route', function () {

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
  }, 'route-segment', 'serverDetailRoute'));

  beforeEach(inject(function (_GROUPS_) {
    GROUPS = _GROUPS_;
  }));

  it('should call when with /configure/server/:id', function () {
    expect($routeSegmentProvider.when).toHaveBeenCalledOnceWith('/configure/server/:id', 'app.serverDetail');
  });

  it('should call within app', function () {
    expect($routeSegmentProvider.within).toHaveBeenCalledOnceWith('app');
  });

  it('should call segmentAuthenticated', function () {
    expect($routeSegmentProvider.segmentAuthenticated).toHaveBeenCalledOnceWith('serverDetail', {
      controller: 'ServerDetailController',
      controllerAs: 'serverDetail',
      templateUrl: 'iml/server/assets/html/server-detail.html',
      resolve: {
        streams: ['serverDetailResolves', jasmine.any(Function)]
      },
      access: GROUPS.FS_ADMINS
    });
  });
});
