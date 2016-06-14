
import highland from 'highland';

import {
  identity
} from 'intel-fp';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('hsm fs resolve', () => {
  var socketStream, s, resolveStream, fsCollStream,
    addProperty, promise;

  beforeEachAsync(async function () {
    s = highland();
    socketStream = jasmine
      .createSpy('socketStream')
      .and
      .returnValue(s);

    promise = Promise.resolve(s);

    resolveStream = jasmine
      .createSpy('resolveStream')
      .and
      .returnValue(promise);

    addProperty = jasmine
      .createSpy('addProperty')
      .and
      .callFake(identity);

    const mod = await mock('source/iml/hsm/hsm-fs-resolves.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream },
      'source/iml/resolve-stream.js': { default: resolveStream },
      'source/iml/highland/add-property.js': { default: addProperty }
    });

    fsCollStream = mod.default;
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

    itAsync('should send the stream through addProperty', async function () {
      await promise;

      expect(addProperty).toHaveBeenCalledOnce();
    });
  });
});
