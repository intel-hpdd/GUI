// @flow

import highland from 'highland';

import { mock, resetAll } from '../../../system-mock.js';

describe('file system dispatch source', () => {
  let store, socketStream, s;

  beforeEachAsync(async function() {
    const CACHE_INITIAL_DATA = {
      filesystem: ['filesystem']
    };

    store = {
      dispatch: jasmine.createSpy('dispatch')
    };

    s = highland();
    socketStream = jasmine.createSpy('socketStream').and.returnValue(s);

    await mock('source/iml/file-system/file-system-dispatch-source.js', {
      'source/iml/store/get-store.js': { default: store },
      'source/iml/environment.js': {
        CACHE_INITIAL_DATA,
        ALLOW_ANONYMOUS_READ: true
      },
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });
  });

  afterEach(resetAll);

  beforeEach(() => {
    s.write({
      meta: 'meta',
      objects: [
        {
          id: 1
        },
        {
          id: 2
        }
      ]
    });
  });

  it('should dispatch cached file systems into the store', () => {
    expect(store.dispatch).toHaveBeenCalledOnceWith({
      type: 'ADD_FS_ITEMS',
      payload: ['filesystem']
    });
  });

  it('should invoke the socket stream', () => {
    expect(socketStream).toHaveBeenCalledOnceWith('/filesystem', {
      qs: {
        jsonMask: 'objects(id,resource_uri,label,locks,name,client_count,bytes_total,bytes_free,available_actions,mgt(primary_server_name,primary_server),mdts(resource_uri))',
        limit: 0
      }
    });
  });

  it('should update file systems when new items arrive from a persistent socket', () => {
    expect(store.dispatch).toHaveBeenCalledOnceWith({
      type: 'ADD_FS_ITEMS',
      payload: [
        {
          id: 1
        },
        {
          id: 2
        }
      ]
    });
  });
});
