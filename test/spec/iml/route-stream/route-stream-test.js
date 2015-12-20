import angular from 'angular';
const {module, inject} = angular.mock;

describe('route stream', function () {
  var $route, qsFromLocation, spy;

  beforeEach(module('routeStream', function ($provide) {
    spy = jasmine.createSpy('spy');

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

  var $rootScope, routeStream, destroyListener;

  beforeEach(inject(function (_routeStream_, _$rootScope_) {
    routeStream = _routeStream_;

    destroyListener = jasmine.createSpy('destroyListener');

    $rootScope = _$rootScope_;

    spyOn($rootScope, '$on')
      .andReturn(destroyListener);
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
