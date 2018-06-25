import highland from 'highland';

describe('user dispatch source', () => {
  let mockStore, mockSocketStream, mockDispatchSourceUtils, s;

  beforeEach(() => {
    mockStore = { dispatch: jest.fn() };
    s = highland();
    mockSocketStream = jest.fn(() => s);
    jest.mock('../../../../source/iml/store/get-store.js', () => mockStore);
    jest.mock('../../../../source/iml/socket/socket-stream.js', () => mockSocketStream);
    mockDispatchSourceUtils = {
      canDispatch: jest.fn(() => true)
    };
    jest.mock('../../../../source/iml/dispatch-source-utils.js', () => mockDispatchSourceUtils);
    jest.mock('../../../../source/iml/user/user-reducer.js', () => ({
      ADD_USER_ITEMS: 'ADD_USER_ITEMS'
    }));

    require('../../../../source/iml/user/user-dispatch-source.js');
  });

  beforeEach(() => {
    s.write({ meta: 'meta', objects: [{ id: 1 }, { id: 2 }] });
  });

  it('should make sure that the app can dispatch', () => {
    expect(mockDispatchSourceUtils.canDispatch).toHaveBeenCalledWith();
  });

  it('should invoke the socket stream', () => {
    expect(mockSocketStream).toHaveBeenCalledOnceWith('/user', {
      qs: { limit: 0 }
    });
  });

  it('should update users when new items arrive from a persistent socket', () => {
    expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
      type: 'ADD_USER_ITEMS',
      payload: [{ id: 1 }, { id: 2 }]
    });
  });
});
