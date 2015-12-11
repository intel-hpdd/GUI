describe('add static dir interceptor', () => {
  var addStaticDirInterceptor;

  beforeEach(module('interceptors', {
    STATIC_URL: '/static/'
  }));

  beforeEach(inject((_addStaticDirInterceptor_) => {
    addStaticDirInterceptor = _addStaticDirInterceptor_;
  }));

  it('should remove the / if one is present at the start of the url', () => {
    var result = addStaticDirInterceptor.request({url: '/adir/afile.html'});

    expect(result).toEqual({url: '/static/adir/afile.html'});
  });

  it('should ignore non-html files', () => {
    var config = {url: '/a/b/c'};

    var result = addStaticDirInterceptor.request(config);

    expect(result).toEqual(config);
  });

  it('should ignore ui bootstrap files', () => {
    var config = {url: '/template/modal.html'};

    var result = addStaticDirInterceptor.request(config);

    expect(result).toEqual(config);
  });
});

