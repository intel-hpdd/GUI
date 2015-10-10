describe('eula state middleware', () => {

  var CACHE_INITIAL_DATA;
  beforeEach(module(function ($provide) {
    CACHE_INITIAL_DATA = {
      session: {
        user: {}
      }
    };

    $provide.constant('CACHE_INITIAL_DATA', CACHE_INITIAL_DATA);
  }, 'middleware'));

  var eulaStateMiddleware, $rootScope, spy;
  beforeEach(inject(function (_eulaStateMiddleware_, _$rootScope_) {
    eulaStateMiddleware = _eulaStateMiddleware_;
    $rootScope = _$rootScope_;
    spy = jasmine.createSpy('spy');
  }));

  describe('without a user', () => {
    it('should resolve without any data', () => {
      delete CACHE_INITIAL_DATA.session.user;
      eulaStateMiddleware().then(spy);
      $rootScope.$digest();

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('with a user defined', () => {
    describe('and eula state set to pass', () => {
      it('should resolve without any data', () => {
        CACHE_INITIAL_DATA.session.user.eula_state = 'pass';
        eulaStateMiddleware().then(spy);
        $rootScope.$digest();

        expect(spy).toHaveBeenCalledOnce();
      });
    });

    describe('and eula state not set to pass', () => {
      it('should reject with /login', () => {
        CACHE_INITIAL_DATA.session.user.eula_state = 'fail';
        eulaStateMiddleware().catch(spy);
        $rootScope.$digest();

        expect(spy).toHaveBeenCalledOnceWith('/login');
      });
    });
  });
});
