// @flow

import highland from 'highland';

describe('file system dispatch source', () => {
  let mockStore, mockSocketStream, s;

  beforeEach(() => {
    jest.resetModules();
    const mockCacheInitialData = {
      filesystem: ['filesystem']
    };

    mockStore = {
      dispatch: jest.fn()
    };

    s = highland();
    mockSocketStream = jest.fn(() => s);

    jest.mock('../../../../source/iml/store/get-store.js', () => mockStore);
    jest.mock('../../../../source/iml/environment.js', () => ({
      CACHE_INITIAL_DATA: mockCacheInitialData,
      ALLOW_ANONYMOUS_READ: true
    }));
    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockSocketStream
    );

    require('../../../../source/iml/file-system/file-system-dispatch-source.js');
  });

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
    expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
      type: 'ADD_FS_ITEMS',
      payload: ['filesystem']
    });
  });

  it('should invoke the socket stream', () => {
    expect(mockSocketStream).toHaveBeenCalledOnceWith('/filesystem', {
      qs: {
        jsonMask: 'objects(id,resource_uri,label,locks,name,client_count,bytes_total,bytes_free,available_actions,mgt(primary_server_name,primary_server),mdts(resource_uri))',
        limit: 0
      }
    });
  });

  it('should update file systems when new items arrive from a persistent socket', () => {
    expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
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
