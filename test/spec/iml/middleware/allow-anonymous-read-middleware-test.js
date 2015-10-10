describe('Allow Anonymous Read Middleware', () => {
  var CACHE_INITIAL_DATA;

  beforeEach(module(($provide) => {
    CACHE_INITIAL_DATA = {
      session: {
        read_enabled: true
      }
    };

    $provide.constant('CACHE_INITIAL_DATA', CACHE_INITIAL_DATA);
  }, 'middleware'));

  var allowAnonymousReadMiddleware, $rootScope, spy;
  beforeEach(inject(function (_allowAnonymousReadMiddleware_, _$rootScope_) {
    allowAnonymousReadMiddleware = _allowAnonymousReadMiddleware_;
    $rootScope = _$rootScope_;
    spy = jasmine.createSpy('spy');
  }));

  it('should return an empty resolved promise when read enabled', () => {
    allowAnonymousReadMiddleware().then(spy);
    $rootScope.$digest();

    expect(spy).toHaveBeenCalledOnce();
  });

  it('should reject the promise with a redirect to /login when not read enabled', () => {
    CACHE_INITIAL_DATA.session.read_enabled = false;
    allowAnonymousReadMiddleware().catch(spy);
    $rootScope.$digest();

    expect(spy).toHaveBeenCalledOnceWith('/login');
  });
});
