import highland from 'highland';

import { streamToPromise as mockStreamToPromise } from '../../../../source/iml/promise-transforms.js';

describe('hsm fs resolve', () => {
  let mockSocketStream,
    s,
    stream,
    mockStore,
    mockResolveStream,
    fsCollStream,
    getData,
    mockBroadcaster,
    promise;

  beforeEach(() => {
    s = highland();
    mockSocketStream = jest.fn(() => s);

    stream = highland();
    mockStore = {
      select: jest.fn(() => stream)
    };

    promise = Promise.resolve(s);

    mockResolveStream = jest.fn(() => promise);

    mockBroadcaster = jest.fn(x => x);

    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockSocketStream
    );
    jest.mock('../../../../source/iml/promise-transforms.js', () => ({
      resolveStream: mockResolveStream,
      streamToPromise: mockStreamToPromise
    }));
    jest.mock('../../../../source/iml/broadcaster.js', () => mockBroadcaster);
    jest.mock('../../../../source/iml/store/get-store.js', () => mockStore);

    const mod = require('../../../../source/iml/hsm/hsm-fs-resolves.js');

    ({ fsCollStream, getData } = mod);
  });

  describe('fsCollStream', () => {
    beforeEach(() => {
      fsCollStream();
    });

    it('should invoke socketStream with a call to filesystem', () => {
      expect(mockSocketStream).toHaveBeenCalledOnceWith('/filesystem', {
        jsonMask: 'objects(id,label,cdt_status,hsm_control_params,locks)'
      });
    });

    it('should resolve the stream', () => {
      expect(mockResolveStream).toHaveBeenCalledOnceWith(s);
    });

    it('should send the stream through broadcaster', async () => {
      await promise;

      expect(mockBroadcaster).toHaveBeenCalledTimes(1);
    });
  });

  describe('getData', () => {
    beforeEach(() => {
      stream.write([
        {
          id: 1,
          label: 1
        }
      ]);
    });

    it('should return the matching fs', async () => {
      const fs = await getData({
        fsId: '1'
      });

      expect(fs).toEqual({
        id: 1,
        label: 1
      });
    });

    it('should return a undefined on a non-match ', async () => {
      const fs = await getData({
        fsId: '2'
      });

      expect(fs).toEqual(undefined);
    });
  });
});
