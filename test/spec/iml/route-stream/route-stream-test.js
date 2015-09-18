describe('route stream', function () {
  var $rootScope, $route, qsFromLocation, spy, destroyListener;

  beforeEach(module('routeStream', function ($provide) {
    spy = jasmine.createSpy('spy');

    destroyListener = jasmine.createSpy('destroyListener');

    $rootScope = {
      $on: jasmine.createSpy('$on')
        .andReturn(destroyListener)
    };
    $provide.value('$rootScope', $rootScope);

    qsFromLocation = jasmine.createSpy('qsFromLocation')
      .andReturn('foo=bar&baz=bap');
    $provide.value('qsFromLocation', qsFromLocation);

    $route = {
      current: {
        route: 'initial'
      }
    };
    $provide.value('$route', $route);
  }));

  var routeStream;

  beforeEach(inject(function (_routeStream_) {
    routeStream = _routeStream_;
  }));

  it('should be a function', function () {
    expect(routeStream).toEqual(jasmine.any(Function));
  });

  it('should deregister the listener on stream destruction', function () {
    routeStream()
      .destroy();

    expect(destroyListener).toHaveBeenCalledOnce();
  });

  describe('invoking', function () {
    var fn;

    beforeEach(function () {
      routeStream().each(spy);
      fn = $rootScope.$on.mostRecentCall.args[1];
    });

    it('should push a route on the stream', function () {
      expect(spy).toHaveBeenCalledOnceWith({
        qs: 'foo=bar&baz=bap',
        route: 'initial'
      });
    });

    it('should push a new route on $routeChangeSuccess', function () {
      fn({}, {
        route: 'next'
      });

      expect(spy).toHaveBeenCalledOnceWith({
        route: 'next',
        qs: 'foo=bar&baz=bap'
      });
    });

    it('should not push a redirected route', function () {
      fn({}, {
        route: 'redirect',
        redirectTo: 'redirectTo'
      });

      expect(spy).not.toHaveBeenCalledWith({
        route: 'redirect',
        redirectTo: 'redirectTo',
        qs: 'foo=bar&baz=bap'
      });
    });
  });
});
