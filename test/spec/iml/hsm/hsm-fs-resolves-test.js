import highland from 'highland';
import * as fp from '@mfl/fp';

import { mock, resetAll } from '../../../system-mock.js';

describe('hsm fs resolve', () => {
  let socketStream,
    s,
    stream,
    store,
    resolveStream,
    fsCollStream,
    getData,
    broadcaster,
    promise;

  beforeEachAsync(async function() {
    s = highland();
    socketStream = jasmine.createSpy('socketStream').and.returnValue(s);

    stream = highland();
    store = {
      select: jasmine.createSpy('select').and.returnValue(stream)
    };

    promise = Promise.resolve(s);

    resolveStream = jasmine.createSpy('resolveStream').and.returnValue(promise);

    broadcaster = jasmine.createSpy('broadcaster').and.callFake(fp.identity);

    const mod = await mock('source/iml/hsm/hsm-fs-resolves.js', {
      'source/iml/socket/socket-stream.js': {
        default: socketStream
      },
      'source/iml/promise-transforms.js': {
        resolveStream
      },
      'source/iml/broadcaster.js': {
        default: broadcaster
      },
      'source/iml/store/get-store.js': {
        default: store
      }
    });

    ({ fsCollStream, getData } = mod);
  });

  afterEach(resetAll);

  describe('fsCollStream', () => {
    beforeEach(() => {
      fsCollStream();
    });

    it('should invoke socketStream with a call to filesystem', () => {
      expect(socketStream).toHaveBeenCalledOnceWith('/filesystem', {
        jsonMask: 'objects(id,label,cdt_status,hsm_control_params,locks)'
      });
    });

    it('should resolve the stream', () => {
      expect(resolveStream).toHaveBeenCalledOnceWith(s);
    });

    itAsync('should send the stream through broadcaster', async function() {
      await promise;

      expect(broadcaster).toHaveBeenCalledTimes(1);
    });
  });

  describe('getData', () => {
    beforeEach(() => {
      stream.write({
        id: 1,
        label: 1
      });
    });

    itAsync('should return the matching fs', async function() {
      const fs = await getData({
        id: 1
      });

      expect(fs).toEqual({
        label: null
      });
    });

    itAsync('should return a null label ', async function() {
      const fs = await getData({
        id: 2
      });

      expect(fs).toEqual({
        label: null
      });
    });
  });
});
