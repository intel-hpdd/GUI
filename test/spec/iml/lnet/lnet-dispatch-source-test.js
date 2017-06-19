import highland from 'highland';

describe('lnet dispatch source', () => {
  let mockStore, s, mockSocketStream;

  beforeEach(() => {
    
    s = highland();
    mockSocketStream = jest.fn(() => s);

    mockStore = {
      dispatch: jest.fn()
    };

    jest.mock('../../../../source/iml/store/get-store.js', () => mockStore);
    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockSocketStream
    );
    jest.mock('../../../../source/iml/environment.js', () => ({
      ALLOW_ANONYMOUS_READ: true
    }));

    require('../../../../source/iml/lnet/lnet-dispatch-source.js');

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

  afterEach(() => (window.angular = null));

  it('should invoke the socket stream', () => {
    expect(mockSocketStream).toHaveBeenCalledOnceWith('/lnet_configuration', {
      qs: {
        dehydrate__host: false,
        limit: 0
      }
    });
  });

  it('should write the objects to the stream', () => {
    expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
      type: 'ADD_LNET_CONFIGURATION_ITEMS',
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

  it('should update lnetConfiguration when new items arrive from a persistent socket', () => {
    s.write({
      meta: 'meta',
      objects: ['more lnet configurations']
    });

    expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
      type: 'ADD_LNET_CONFIGURATION_ITEMS',
      payload: ['more lnet configurations']
    });
  });
});
