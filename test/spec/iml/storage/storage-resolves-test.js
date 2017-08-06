// @flow

import highland from 'highland';
import { streamToPromise } from '../../../../source/iml/promise-transforms.js';

describe('storage resolves', () => {
  let mockStore,
    mockSocketStream,
    state,
    storageB,
    alertIndicatorB,
    getData,
    storageResource$;

  beforeEach(() => {
    state = {
      resourceClasses: [{ plugin_name: 'pluginName', class_name: 'className' }],
      resources: null,
      config: {
        selectIndex: 0,
        sortKey: '',
        sortDesc: false,
        loading: false,
        entries: 10,
        offset: 0
      }
    };

    mockSocketStream = jest.fn(() => highland([{ plugin_name: 'foo' }]));

    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockSocketStream
    );

    mockStore = jest.genMockFromModule(
      '../../../../source/iml/store/get-store.js'
    ).default;
    const s = highland();

    mockStore.select.mockImplementationOnce(key => {
      switch (key) {
        case 'storage':
          s.write(state);
          break;

        default:
          s.write('state');
          break;
      }

      return s;
    });
    jest.mock('../../../../source/iml/store/get-store.js', () => mockStore);

    ({
      storageB,
      alertIndicatorB,
      getData,
      storageResource$
    } = require('../../../../source/iml/storage/storage-resolves.js'));
  });

  it('should resolve from storage', async () => {
    const b = await storageB();

    const x = await streamToPromise(b());

    expect(x).toEqual(state);
  });

  it('should call the storage reducer', async () => {
    await storageB();

    expect(mockStore.select).toHaveBeenCalledOnceWith('storage');
  });

  it('should call the alertIndicator reducer', async () => {
    await alertIndicatorB();

    expect(mockStore.select).toHaveBeenCalledOnceWith('alertIndicators');
  });

  it('should resolve from storage', async () => {
    const b = await alertIndicatorB();

    const x = await streamToPromise(b());

    expect(x).toEqual('state');
  });

  it('should resolve getData', async () => {
    expect.assertions(2);

    const x = await getData({ id: '3' });

    expect(mockSocketStream).toHaveBeenCalledOnceWith(
      '/api/storage_resource/3',
      {},
      true
    );

    expect(x).toEqual({ label: 'foo' });
  });

  it('should resolve storageResource$', async () => {
    expect.assertions(2);

    const s = await storageResource$({ id: '3' });
    const x = await streamToPromise(s);

    expect(mockSocketStream).toHaveBeenCalledOnceWith(
      '/api/storage_resource/3',
      {},
      true
    );

    expect(x).toEqual({ plugin_name: 'foo' });
  });
});
