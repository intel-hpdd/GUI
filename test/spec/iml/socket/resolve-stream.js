describe('resolve stream', function () {
  'use strict';

  beforeEach(module('socket-module'));

  var resolveStream, stream, $rootScope, Stream, spy;

  beforeEach(inject(function (_resolveStream_, _$rootScope_) {
    stream = highland();
    Stream = stream.constructor;

    spy = jasmine.createSpy('spy');

    resolveStream = _resolveStream_;

    $rootScope = _$rootScope_;
  }));

  it('should be a function', function () {
    expect(resolveStream).toEqual(jasmine.any(Function));
  });

  describe('writing a value', function () {
    var promise;

    beforeEach(function () {
      stream.write('foo');

      promise = resolveStream(stream);
    });

    it('should resolve with a stream', function () {
      promise
        .then(spy);

      $rootScope.$digest();

      expect(spy).toHaveBeenCalledOnceWith(jasmine.any(Stream));
    });

    it('should contain the value', function () {
      promise
        .then(function (s) {
          s.each(spy);
        });

      $rootScope.$digest();

      expect(spy).toHaveBeenCalledOnceWith('foo');
    });
  });

  describe('write error', function () {
    var promise;

    beforeEach(function () {
      var err = {
        __HighlandStreamError__: true,
        error: new Error('boom!')
      };

      stream.write(err);

      promise = resolveStream(stream);
    });

    it('should resolve with a stream', function () {
      promise
        .then(spy);

      $rootScope.$digest();

      expect(spy).toHaveBeenCalledOnceWith(jasmine.any(Stream));
    });

    it('should contain the error', function () {
      promise
        .then(function (s) {
          s.stopOnError(_.unary(spy))
            .each(_.noop);
        });

      $rootScope.$digest();

      expect(spy).toHaveBeenCalledOnceWith(new Error('boom!'));
    });
  });
});
