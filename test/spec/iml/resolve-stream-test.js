import highland from 'highland';

import {
  noop,
  curry
} from 'intel-fp';

import resolveStream from '../../../source/iml/resolve-stream.js';

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
        .stopOnError(curry(1, spy))
        .each(noop);


      expect(spy)
        .toHaveBeenCalledOnceWith(new Error('boom!'));
    });
  });
});
