import middlewareModule from '../../../../source/iml/middleware/middleware-module';

describe('process middleware', () => {
  var $location, mockMiddlewarePromise, mockMiddlewareFailPromise;
  beforeEach(module(($provide) => {
    mockMiddlewarePromise = jasmine.createSpy('mockMiddlewarePromise');
    mockMiddlewareFailPromise = jasmine.createSpy('mockMiddlewareFailPromise');

    $location = {
      path: jasmine.createSpy('path')
    };

    $provide.value('$location', $location);
    $provide.value('mockMiddleware', mockMiddlewarePromise);
    $provide.value('mockMiddlewareFail', mockMiddlewareFailPromise);
  }, middlewareModule));

  var spy, processMiddleware, $rootScope;
  beforeEach(inject((_processMiddleware_, _$rootScope_, $q) => {
    processMiddleware = _processMiddleware_;
    $rootScope = _$rootScope_;

    mockMiddlewarePromise.and.returnValue($q.when());
    mockMiddlewareFailPromise.and.returnValue($q.reject('/login'));

    spy = jasmine.createSpy('spy');
  }));

  it('should resolve without a value when no middleware is defined', () => {
    processMiddleware().then(spy);
    $rootScope.$digest();

    expect(spy).toHaveBeenCalledOnce();
  });

  describe('when all middleware succeed', () => {
    it('should invoke the middleware', () => {
      processMiddleware(['mockMiddleware']);
      $rootScope.$digest();

      expect(mockMiddlewarePromise).toHaveBeenCalledOnce();
    });
  });

  describe('where any middleware is rejected', () => {
    beforeEach(() => {
      processMiddleware(['mockMiddlewareFail', 'mockMiddleware']).catch(spy);
      $rootScope.$digest();
    });

    it('should invoke the middleware that will fail', () => {
      expect(mockMiddlewareFailPromise).toHaveBeenCalledOnce();
    });

    it('should not invoke the middleware that does not fail if it comes after the failing middleware', () => {
      expect(mockMiddlewarePromise).not.toHaveBeenCalled();
    });

    it('should reject', () => {
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should call $location.path with the target path', () => {
      expect($location.path).toHaveBeenCalledOnceWith('/login');
    });
  });
});
