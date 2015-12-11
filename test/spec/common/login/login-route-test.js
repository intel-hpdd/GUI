describe('login route', () => {
  var $routeSegmentProvider;

  beforeEach(module(() => {
    $routeSegmentProvider = {
      $get: function get () {},
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
        .andCallFake(routeSegmentProvider),
      when: jasmine.createSpy('$routeSegmentProvider.when')
        .andCallFake(routeSegmentProvider)
    };

    function routeSegmentProvider () {
      return $routeSegmentProvider;
    }

    angular.module('route-segment', []).provider({
      $routeSegment: $routeSegmentProvider
    });
  }, 'route-segment', 'loginRoute'));

  beforeEach(inject(fp.noop));

  it('should register the login route', () => {
    expect($routeSegmentProvider.when)
      .toHaveBeenCalledOnceWith('/login', 'login');
  });

  it('should register the segment', () => {
    expect($routeSegmentProvider.segment)
      .toHaveBeenCalledOnceWith('login', {
        controller: 'LoginCtrl',
        controllerAs: 'login',
        templateUrl: 'common/login/assets/html/login.html'
      });
  });
});
