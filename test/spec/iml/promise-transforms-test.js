import highland from 'highland';

import {
  noop,
  curry
} from 'intel-fp';

import {
  pick
} from 'intel-obj';

import {
  resolveStream,
  streamToPromise,
  extendParentData
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
        .stopOnError(curry(1, spy))
        .each(noop);


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

    const p = streamToPromise(s);
    p.then(curry(1, spy));
    await p;

    expect(spy).toHaveBeenCalledOnceWith({foo: 'bar'});
  });

  itAsync('should handle errors', async function () {
    const err = {
      __HighlandStreamError__: true,
      error: new Error('boom!')
    };
    s.write(err);

    await streamToPromise(s)
      .catch(curry(1, spy));

    expect(spy).toHaveBeenCalledOnceWith(err.error);
  });

  itAsync('should destroy the stream when finished', async function () {
    s.write('data');
    await streamToPromise(s);

    expect(s.destroy).toHaveBeenCalledOnce();
  });
});

describe('extend parent data', () => {
  let data, s, parentData;
  beforeEach(() => {
    data = {
      id: 3,
      label: 'fs1-MDT0003',
      kind: 'mdt'
    };

    parentData = {
      id: 1,
      label: 'fs'
    };

    s = highland();
    s.write(data);
  });

  itAsync('should extend the data with a parent object', async function () {
    let result = await streamToPromise(s)
      .then(pick(['id', 'label', 'kind']))
      .then(extendParentData(parentData));

    expect(result).toEqual({
      id: 3,
      label: 'fs1-MDT0003',
      kind: 'mdt',
      parent: {
        id: 1,
        label: 'fs'
      }
    });
  });
});
