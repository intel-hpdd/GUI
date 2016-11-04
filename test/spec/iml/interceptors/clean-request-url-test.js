import interceptorsModule
  from '../../../../source/iml/interceptors/interceptor-module';


describe('clean request url interceptor', () => {
  let cleanRequestUrlInterceptor;

  beforeEach(module(interceptorsModule));

  beforeEach(inject((_cleanRequestUrlInterceptor_) => {
    cleanRequestUrlInterceptor = _cleanRequestUrlInterceptor_;
  }));

  it('should append a / if one is not present at the end of the url', () => {
    const result = cleanRequestUrlInterceptor.request({url: '/a/b/c'});

    expect(result).toEqual({url: '/a/b/c/'});
  });

  it('should not change a url that already ends with /', () => {
    const config = {url: '/a/b/c/'};

    const result = cleanRequestUrlInterceptor.request(config);

    expect(result).toEqual(config);
  });

  it('should ignore html files', () => {
    const config = {url: 'adir/afile.html'};

    const result = cleanRequestUrlInterceptor.request(config);

    expect(result).toEqual(config);
  });
});
