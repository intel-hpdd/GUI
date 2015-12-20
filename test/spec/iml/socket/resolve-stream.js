import angular from 'angular';
const {module, inject} = angular.mock;

describe('resolve stream', () => {
  'use strict';

  beforeEach(module('socket-module'));

  let resolveStream, stream, $rootScope, Stream, spy;

  beforeEach(inject((_resolveStream_, _$rootScope_) => {
    stream = highland();
    Stream = stream.constructor;

    spy = jasmine.createSpy('spy');

    resolveStream = _resolveStream_;

    $rootScope = _$rootScope_;
  }));

  it('should be a function', () => {
    expect(resolveStream).toEqual(jasmine.any(Function));
  });

  describe('writing a value', () => {
    let promise;

    beforeEach(() => {
      stream.write('foo');

      promise = resolveStream(stream);
    });

    it('should resolve with a stream', () => {
      promise
        .then(spy);

      $rootScope.$digest();

      expect(spy).toHaveBeenCalledOnceWith(jasmine.any(Stream));
    });

    it('should contain the value', () => {
      promise
        .then((s) => {
          s.each(spy);
        });

      $rootScope.$digest();

      expect(spy).toHaveBeenCalledOnceWith('foo');
    });
  });

  describe('write error', () => {
    let promise;

    beforeEach(() => {
      const err = {
        __HighlandStreamError__: true,
        error: new Error('boom!')
      };

      stream.write(err);

      promise = resolveStream(stream);
    });

    it('should resolve with a stream', () => {
      promise
        .then(spy);

      $rootScope.$digest();

      expect(spy).toHaveBeenCalledOnceWith(jasmine.any(Stream));
    });

    it('should contain the error', () => {
      promise
        .then((s) => {
          s.stopOnError(_.unary(spy))
            .each(fp.noop);
        });

      $rootScope.$digest();

      expect(spy).toHaveBeenCalledOnceWith(new Error('boom!'));
    });
  });
});
