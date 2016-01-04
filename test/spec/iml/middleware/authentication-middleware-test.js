import angular from 'angular';
const {module, inject} = angular.mock;

describe('Authentication Middleware', () => {

  var authorization;
  beforeEach(module('middleware', function ($provide) {
    authorization = {
      groupAllowed: jasmine.createSpy('groupAllowed').and.returnValue(true)
    };

    $provide.value('authorization', authorization);
  }));

  var authenticationMiddleware, $rootScope, GROUPS, spy;
  beforeEach(inject(function (_authenticationMiddleware_, _GROUPS_, _$rootScope_) {
    GROUPS = _GROUPS_;
    authenticationMiddleware = _authenticationMiddleware_;
    $rootScope = _$rootScope_;
    spy = jasmine.createSpy('spy');
  }));

  it('should call groupAllowed', () => {
    authenticationMiddleware();
    expect(authorization.groupAllowed).toHaveBeenCalledOnceWith(GROUPS.FS_ADMINS);
  });

  describe('when authenticated', () => {
    it('should return a resolved promise', () => {
      authenticationMiddleware().then(spy);
      $rootScope.$digest();

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('when not authenticated', () => {
    it('should reject the promise with \'/\'', () => {
      authorization.groupAllowed = jasmine.createSpy('groupAllowed').and.returnValue(false);
      authenticationMiddleware().catch(spy);
      $rootScope.$digest();

      expect(spy).toHaveBeenCalledOnceWith('/');
    });
  });
});
