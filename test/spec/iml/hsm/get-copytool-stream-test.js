import highland from 'highland';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('get copytool stream', () => {
  var socketStream, stream, getCopytoolStream;

  beforeEachAsync(async function () {
    stream = highland();

    socketStream = jasmine.createSpy('socketStream')
      .and.returnValue(stream);

    const mod = await mock('source/iml/hsm/get-copytool-stream.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });

    getCopytoolStream = mod.default;
  });

  afterEach(resetAll);

  it('should get a stream', () => {
    getCopytoolStream();

    expect(socketStream)
      .toHaveBeenCalledOnceWith('/copytool', {
        qs: {
          limit: 0
        },
        jsonMask: 'objects(id,label,host/label,archive,state,\
active_operations_count,available_actions,resource_uri,locks)'
      });
  });

  it('should set status to state if not started', () => {
    getCopytoolStream()
      .each(expectToEqual([{
        state: 'finished',
        status: 'finished'
      }
      ]));

    stream.write({
      objects: [
        {
          state: 'finished'
        }
      ]
    });
  });

  it('should set status to idle if no active operations', () => {
    getCopytoolStream()
      .each(expectToEqual([{
        active_operations_count: 0,
        state: 'started',
        status: 'idle'
      }
      ]));

    stream.write({
      objects: [
        {
          state: 'started',
          active_operations_count: 0
        }
      ]
    });
  });

  it('should set status to working', () => {
    getCopytoolStream()
      .each(expectToEqual([{
        active_operations_count: 1,
        state: 'started',
        status: 'working'
      }
      ]));

    stream.write({
      objects: [
        {
          state: 'started',
          active_operations_count: 1
        }
      ]
    });
  });
});
