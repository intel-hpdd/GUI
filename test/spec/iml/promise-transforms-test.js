import highland from 'highland';
import * as fp from 'intel-fp';

import {
  resolveStream,
  streamToPromise
} from '../../../source/iml/promise-transforms.js';

describe('resolve stream', () => {
  let stream, Stream, spy;

  beforeEach(() => {
    stream = highland();
    Stream = stream.constructor;

    spy = jasmine.createSpy('spy');
  });

  it('should be a function', () => {
    expect(resolveStream)
      .toEqual(jasmine.any(Function));
  });

  describe('writing a value', () => {
    let promise;

    beforeEach(() => {
      stream.write('foo');

      promise = resolveStream(stream);
    });

    itAsync('should resolve with a stream', async function () {
      const s = await promise;

      expect(s)
        .toEqual(jasmine.any(Stream));
    });

    itAsync('should contain the value', async function () {
      const s = await promise;

      s.each(spy);

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

    itAsync('should resolve with a stream', async function () {
      const s = await promise;

      expect(s).toEqual(jasmine.any(Stream));
    });

    itAsync('should contain the error', async function () {
      const s = await promise;

      s
        .stopOnError(fp.unary(spy))
        .each(fp.noop);


      expect(spy)
        .toHaveBeenCalledOnceWith(new Error('boom!'));
    });
  });
});

describe('stream to promise', () => {
  let s, spy;
  beforeEach(() => {
    spy = jasmine.createSpy('spy');
    s = highland();
    spyOn(s, 'destroy');
  });

  it('should be a function', () => {
    expect(streamToPromise).toEqual(jasmine.any(Function));
  });

  itAsync('should return the data in a promise', async function () {
    s.write({foo: 'bar'});

    const p = await streamToPromise(s);
    expect(p).toEqual({foo: 'bar'});
  });

  itAsync('should handle errors', async function () {
    const err = {
      __HighlandStreamError__: true,
      error: new Error('boom!')
    };
    s.write(err);

    await streamToPromise(s)
      .catch(fp.unary(spy));

    expect(spy).toHaveBeenCalledOnceWith(err.error);
  });

  itAsync('should destroy the stream when finished', async function () {
    s.write('data');
    await streamToPromise(s);

    expect(s.destroy).toHaveBeenCalledOnce();
  });
});
