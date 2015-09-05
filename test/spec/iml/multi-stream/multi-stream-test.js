describe('multi stream', function () {
  beforeEach(module('multiStream'));

  var multiStream, spy, errSpy, s1, s2, ms;

  beforeEach(inject(function (_multiStream_) {
    multiStream = _multiStream_;
    spy = jasmine.createSpy('spy');
    errSpy = jasmine.createSpy('errSpy');

    s1 = highland();
    spyOn(s1, 'destroy');
    s2 = highland();
    spyOn(s2, 'destroy');
    ms = multiStream([s1, s2]);
    ms
      .stopOnError(fp.curry(1, errSpy))
      .each(spy);
  }));

  it('should be a function', function () {
    expect(multiStream).toEqual(jasmine.any(Function));
  });

  it('should not emit if all streams not written', function () {
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not emit if all streams not written', function () {
    s1.write('foo');

    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit if all streams written', function () {
    s1.write('foo');
    s2.write('bar');

    expect(spy).toHaveBeenCalledOnceWith(['foo', 'bar']);
  });

  it('should emit errors', function () {
    s1.write({
      __HighlandStreamError__: true,
      error: new Error('boom!')
    });

    expect(errSpy).toHaveBeenCalledOnceWith(new Error('boom!'));
  });

  it('should update if stream 1 writes', function () {
    s1.write('foo');
    s2.write('bar');
    s1.write('baz');

    expect(spy).toHaveBeenCalledOnceWith(['baz', 'bar']);
  });

  it('should update if stream 2 writes', function () {
    s2.write('bar');
    s1.write('foo');
    s2.write('bap');

    expect(spy).toHaveBeenCalledOnceWith(['foo', 'bap']);
  });

  describe('on Destroy', function () {
    beforeEach(function () {
      ms.destroy();
    });

    it('should destroy stream 1', function () {
      expect(s1.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy stream 2', function () {
      expect(s2.destroy).toHaveBeenCalledOnce();
    });
  });
});
