import interceptorsModule
  from '../../../../source/iml/interceptors/interceptor-module';
import angular from '../../../angular-mock-setup.js';

describe('add static dir interceptor', () => {
  let addStaticDirInterceptor;

  beforeEach(
    angular.mock.module(interceptorsModule, {
      STATIC_URL: '/static/'
    })
  );

  beforeEach(
    inject(_addStaticDirInterceptor_ => {
      addStaticDirInterceptor = _addStaticDirInterceptor_;
    })
  );

  it('should remove the / if one is present at the start of the url', () => {
    const result = addStaticDirInterceptor.request({ url: '/adir/afile.html' });

    expect(result).toEqual({ url: '/static/adir/afile.html' });
  });

  it('should ignore non-html files', () => {
    const config = { url: '/a/b/c' };

    const result = addStaticDirInterceptor.request(config);

    expect(result).toEqual(config);
  });

  it('should ignore ui bootstrap files', () => {
    const config = { url: '/template/modal.html' };

    const result = addStaticDirInterceptor.request(config);

    expect(result).toEqual(config);
  });
});
