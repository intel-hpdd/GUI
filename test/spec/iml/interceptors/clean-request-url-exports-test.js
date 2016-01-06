import angular from 'angular';
const {module, inject} = angular.mock;

describe('clean request url interceptor', () => {
  var cleanRequestUrlInterceptor;

  beforeEach(module('interceptors'));

  beforeEach(inject((_cleanRequestUrlInterceptor_) => {
    cleanRequestUrlInterceptor = _cleanRequestUrlInterceptor_;
  }));

  it('should append a / if one is not present at the end of the url', () => {
    var result = cleanRequestUrlInterceptor.request({url: '/a/b/c'});

    expect(result).toEqual({url: '/a/b/c/'});
  });

  it('should not change a url that already ends with /', () => {
    var config = {url: '/a/b/c/'};

    var result = cleanRequestUrlInterceptor.request(config);

    expect(result).toEqual(config);
  });

  it('should ignore html files', () => {
    var config = {url: 'adir/afile.html'};

    var result = cleanRequestUrlInterceptor.request(config);

    expect(result).toEqual(config);
  });
});
