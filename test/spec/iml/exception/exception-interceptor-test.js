import exceptionModule from '../../../../source/iml/exception/exception-module';

describe('Exception interceptor', () => {
  let exceptionInterceptor, exceptionHandler, response, $rootScope, error, errbackSpy;

  beforeEach(module({STATIC_URL: '/api/'}, exceptionModule, function ($provide) {
    $provide.value('$exceptionHandler', jasmine.createSpy('$exceptionHandler'));
  }));

  beforeEach(inject(function (_exceptionInterceptor_, _$exceptionHandler_, _$rootScope_) {
    exceptionInterceptor = _exceptionInterceptor_;
    exceptionHandler = _$exceptionHandler_;
    $rootScope = _$rootScope_;
    errbackSpy = jasmine.createSpy('errbackSpy');
    error = new Error('Test Error!');

    response = {
      data: {},
      status: 500,
      headers: jasmine.createSpy('headers').and.callFake(function () {
        return {};
      }),
      config: {
        method: 'GET',
        url: '/foo'
      }
    };
  }));

  describe('request error', function () {
    it('should call $exceptionHandler with the same error that was passed in', function () {
      exceptionInterceptor.requestError(error);

      expect(exceptionHandler).toHaveBeenCalledOnceWith(error);
    });

    it('should call $exceptionHandler with a cause if passed a string.', function () {
      const errorString = 'Uh Oh!';

      exceptionInterceptor.requestError(errorString);

      expect(exceptionHandler).toHaveBeenCalledWith(null, errorString);
    });

    describe('custom error', function () {
      let strangeError, customError;

      beforeEach(function () {
        strangeError = {foo: 'bar'};

        exceptionInterceptor.requestError(strangeError);

        customError = exceptionHandler.calls.mostRecent().args[0];
      });

      it('should call $exceptionHandler with a custom error', function () {
        expect(customError).toEqual(jasmine.any(Error));
      });

      it('should add the rejection as a property to the custom error', function () {
        expect(customError.rejection).toEqual(strangeError);
      });
    });
  });

  describe('response error', function ( ) {
    const passThroughs = [400, 403];

    passThroughs.forEach(function testStatus (status) {
      it('should reject ' + status + ' errors', function () {
        response.status = status;

        const out = exceptionInterceptor.responseError(response);

        out.then(null, errbackSpy);

        $rootScope.$digest();

        expect(errbackSpy).toHaveBeenCalled();
      });

      it('should not call the $exceptionHandler with an error on ' + status + 's', function () {
        response.status = status;

        exceptionInterceptor.responseError(response);

        expect(exceptionHandler.calls.count()).toBe(0);
      });
    });

    it('should call the $exceptionHandler with an error on 0s', function () {
      response.status = 0;

      exceptionInterceptor.responseError(response);

      expect(exceptionHandler.calls.count()).toBe(1);
    });

    it('should reject 500 errors', function () {
      const out = exceptionInterceptor.responseError(response);

      out.then(null, errbackSpy);

      $rootScope.$digest();

      expect(errbackSpy).toHaveBeenCalled();
    });

    it('should call the $exceptionHandler with an error on 500s', function () {
      exceptionInterceptor.responseError(response);

      const error = exceptionHandler.calls.mostRecent().args[0];

      expect(error).toEqual(jasmine.any(Error));
    });
  });
});
