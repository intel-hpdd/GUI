// @flow

import highland from 'highland';

describe('storageDispatchSource', () => {
  let mockStore, mockSocketStream, mockDispatchSourceUtils, state;

  beforeEach(() => {
    state = {
      resourceClasses: [{ user_creatable: false }, { user_creatable: true }],
      resources: null,
      config: {
        selectIndex: null,
        sortKey: '',
        sortDesc: false,
        loading: false,
        entries: 10,
        offset: 0
      }
    };

    mockStore = jest.genMockFromModule('../../../../source/iml/store/get-store.js').default;
    const s = highland();

    mockStore.select.mockImplementationOnce(() => {
      s.write(state);

      return s;
    });

    mockSocketStream = jest.fn(() => highland([{ objects: [] }]));
    jest.mock('../../../../source/iml/socket/socket-stream.js', () => mockSocketStream);
    jest.mock('../../../../source/iml/store/get-store.js', () => mockStore);
    mockDispatchSourceUtils = {
      canDispatch: jest.fn(() => true)
    };
    jest.mock('../../../../source/iml/dispatch-source-utils.js', () => mockDispatchSourceUtils);

    require('../../../../source/iml/storage/storage-dispatch-source.js');
  });

  it('should make sure that the app can dispatch', () => {
    expect(mockDispatchSourceUtils.canDispatch).toHaveBeenCalledWith();
  });

  it('should call the socketStream', () => {
    expect(mockSocketStream).toHaveBeenCalledOnceWith('/storage_resource_class', {
      qs: { limit: 0, plugin_internal: false }
    });
  });

  it('should dispatch the storageResources', () => {
    expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
      payload: [],
      type: 'ADD_STORAGE_RESOURCE_CLASSES'
    });
  });

  it('should select from storage', () => {
    expect(mockStore.select).toHaveBeenCalledOnceWith('storage');
  });

  it('should dispatch selected index', () => {
    expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
      payload: 1,
      type: 'SET_STORAGE_SELECT_INDEX'
    });
  });
});
