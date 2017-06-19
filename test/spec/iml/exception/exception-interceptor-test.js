import exceptionInterceptorFactory from '../../../../source/iml/exception/exception-interceptor.js';
import angular from '../../../angular-mock-setup.js';

describe('Exception interceptor', () => {
  let exceptionInterceptor,
    exceptionHandler,
    response,
    $rootScope,
    error,
    errbackSpy;

  beforeEach(
    angular.mock.inject((_$exceptionHandler_, _$rootScope_, _$q_) => {
      exceptionHandler = jest.fn();
      $rootScope = _$rootScope_;
      errbackSpy = jest.fn();
      error = new Error('Test Error!');

      response = {
        data: {},
        status: 500,
        headers: jest.fn(() => ({})),
        config: {
          method: 'GET',
          url: '/foo'
        }
      };

      exceptionInterceptor = exceptionInterceptorFactory(
        exceptionHandler,
        _$q_
      );
    })
  );

  describe('request error', () => {
    it('should call $exceptionHandler with the same error that was passed in', () => {
      exceptionInterceptor.requestError(error);

      expect(exceptionHandler).toHaveBeenCalledOnceWith(error);
    });

    it('should call $exceptionHandler with a cause if passed a string.', () => {
      const errorString = 'Uh Oh!';

      exceptionInterceptor.requestError(errorString);

      expect(exceptionHandler).toHaveBeenCalledWith(null, errorString);
    });

    describe('custom error', () => {
      let strangeError, customError;

      beforeEach(() => {
        strangeError = { foo: 'bar' };

        exceptionInterceptor.requestError(strangeError);

        customError = exceptionHandler.mock.calls[0][0];
      });

      it('should call $exceptionHandler with a custom error', () => {
        expect(customError).toEqual(expect.any(Error));
      });

      it('should add the rejection as a property to the custom error', () => {
        expect(customError.rejection).toEqual(strangeError);
      });
    });
  });

  describe('response error', () => {
    const passThroughs = [400, 403];

    passThroughs.forEach(status => {
      it('should reject ' + status + ' errors', () => {
        response.status = status;

        const out = exceptionInterceptor.responseError(response);

        out.then(null, errbackSpy);

        $rootScope.$digest();

        expect(errbackSpy).toHaveBeenCalled();
      });

      it(
        'should not call the $exceptionHandler with an error on ' +
          status +
          's',
        () => {
          response.status = status;

          exceptionInterceptor.responseError(response);

          expect(exceptionHandler.mock.calls.length).toBe(0);
        }
      );
    });

    it('should call the $exceptionHandler with an error on 0s', () => {
      response.status = 0;

      exceptionInterceptor.responseError(response);

      expect(exceptionHandler.mock.calls.length).toBe(1);
    });

    it('should reject 500 errors', () => {
      const out = exceptionInterceptor.responseError(response);

      out.then(null, errbackSpy);

      $rootScope.$digest();

      expect(errbackSpy).toHaveBeenCalled();
    });

    it('should call the $exceptionHandler with an error on 500s', () => {
      exceptionInterceptor.responseError(response);

      const error = exceptionHandler.mock.calls[0][0];

      expect(error).toEqual(expect.any(Error));
    });
  });
});
