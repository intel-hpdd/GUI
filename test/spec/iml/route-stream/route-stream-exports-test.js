import angular from 'angular';
const {module, inject} = angular.mock;

describe('route stream', () => {
  var $route, qsFromLocation, spy;

  beforeEach(module('routeStream', ($provide) => {
    spy = jasmine.createSpy('spy');

    qsFromLocation = jasmine.createSpy('qsFromLocation')
      .and.returnValue('foo=bar&baz=bap');
    $provide.value('qsFromLocation', qsFromLocation);

    $route = {
      current: {
        route: 'initial',
        $$route: {
          segment: 'foo.bar.baz'
        }
      }
    };
    $provide.value('$route', $route);
  }));

  var $rootScope, routeStream, destroyListener;

  beforeEach(inject((_routeStream_, _$rootScope_) => {
    routeStream = _routeStream_;

    destroyListener = jasmine.createSpy('destroyListener');

    $rootScope = _$rootScope_;

    spyOn($rootScope, '$on')
      .and.returnValue(destroyListener);
  }));

  it('should be a function', () => {
    expect(routeStream).toEqual(jasmine.any(Function));
  });

  it('should deregister the listener on stream destruction', () => {
    routeStream()
      .destroy();

    expect(destroyListener).toHaveBeenCalledOnce();
  });

  describe('contains', () => {
    var current;

    beforeEach(() => {
      routeStream()
        .each(spy);

      current = spy.calls.mostRecent().args[0];
    });

    it('should return true if route contains segment', () => {
      expect(current.contains('bar')).toBe(true);
    });

    it('should return false if route does not contain segment', () => {
      expect(current.contains('bap')).toBe(false);
    });
  });

  describe('invoking', () => {
    var fn;

    beforeEach(() => {
      routeStream().each(spy);
      fn = $rootScope.$on.calls.mostRecent().args[1];
    });

    it('should push a route on the stream', () => {
      expect(spy).toHaveBeenCalledOnceWith({
        qs: 'foo=bar&baz=bap',
        route: 'initial',
        $$route: {
          segment: 'foo.bar.baz'
        },
        contains: jasmine.any(Function)
      });
    });

    it('should push a new route on $routeChangeSuccess', () => {
      fn({}, {
        route: 'next'
      });

      expect(spy).toHaveBeenCalledOnceWith({
        route: 'next',
        qs: 'foo=bar&baz=bap',
        contains: jasmine.any(Function)
      });
    });

    it('should not push a redirected route', () => {
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
