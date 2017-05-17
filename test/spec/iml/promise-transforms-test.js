import highland from 'highland';
import * as fp from '@mfl/fp';

import {
  resolveStream,
  streamToPromise
} from '../../../source/iml/promise-transforms.js';

describe('resolve stream', () => {
  let stream, Stream, spy;

  beforeEach(() => {
    stream = highland();
    Stream = stream.constructor;

    spy = jest.fn();
  });

  it('should be a function', () => {
    expect(resolveStream).toEqual(expect.any(Function));
  });

  describe('writing a value', () => {
    let promise;

    beforeEach(() => {
      stream.write('foo');

      promise = resolveStream(stream);
    });

    it('should resolve with a stream', async () => {
      const s = await promise;

      expect(s).toEqual(expect.any(Stream));
    });

    it('should contain the value', async () => {
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

    it('should resolve with a stream', async () => {
      const s = await promise;

      expect(s).toEqual(expect.any(Stream));
    });

    it('should contain the error', async () => {
      const s = await promise;

      s.stopOnError(fp.unary(spy)).each(fp.noop);

      expect(spy).toHaveBeenCalledOnceWith(new Error('boom!'));
    });
  });
});

describe('stream to promise', () => {
  let s, spy;
  beforeEach(() => {
    spy = jest.fn();
    s = highland();
    spyOn(s, 'destroy');
  });

  it('should be a function', () => {
    expect(streamToPromise).toEqual(expect.any(Function));
  });

  it('should return the data in a promise', async () => {
    s.write({ foo: 'bar' });

    const p = await streamToPromise(s);
    expect(p).toEqual({ foo: 'bar' });
  });

  it('should handle errors', async () => {
    const err = {
      __HighlandStreamError__: true,
      error: new Error('boom!')
    };
    s.write(err);

    await streamToPromise(s).catch(fp.unary(spy));

    expect(spy).toHaveBeenCalledOnceWith(err.error);
  });

  it('should destroy the stream when finished', async () => {
    s.write('data');
    await streamToPromise(s);

    expect(s.destroy).toHaveBeenCalledTimes(1);
  });
});
