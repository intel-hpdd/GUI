import highland from 'highland';

describe('user dispatch source', () => {
  let mockStore, mockSocketStream, s;

  beforeEach(() => {
    mockStore = { dispatch: jest.fn() };
    s = highland();
    mockSocketStream = jest.fn(() => s);
    jest.mock('../../../../source/iml/store/get-store.js', () => mockStore);
    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockSocketStream
    );
    jest.mock('../../../../source/iml/environment.js', () => ({
      ALLOW_ANONYMOUS_READ: true
    }));
    jest.mock('../../../../source/iml/user/user-reducer.js', () => ({
      ADD_USER_ITEMS: 'ADD_USER_ITEMS'
    }));

    require('../../../../source/iml/user/user-dispatch-source.js');
  });

  beforeEach(() => {
    s.write({ meta: 'meta', objects: [{ id: 1 }, { id: 2 }] });
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
