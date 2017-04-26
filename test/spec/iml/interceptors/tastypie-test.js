import interceptorsModule from '../../../../source/iml/interceptors/interceptor-module';
import angular from '../../../angular-mock-setup.js';

describe('tastypie interceptor', () => {
  let tastypieInterceptor;

  beforeEach(angular.mock.module(interceptorsModule));

  beforeEach(
    angular.mock.inject(_tastypieInterceptor_ => {
      tastypieInterceptor = _tastypieInterceptor_;
    })
  );

  it('should move other properties from tastypie response to a new prop', () => {
    const result = tastypieInterceptor.response({
      data: {
        meta: {},
        objects: []
      }
    });

    expect(result).toEqual({
      props: {
        meta: {}
      },
      data: []
    });
  });

  it("should not alter the resp if it doesn't look like it originated from tastypie", () => {
    const resp = {
      data: {
        meta: {},
        object: {}
      }
    };

    const result = tastypieInterceptor.response(resp);

    expect(result).toEqual(resp);
  });
});
