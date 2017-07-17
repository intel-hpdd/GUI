// @flow

import highland from 'highland';
import { streamToPromise } from '../../../../source/iml/promise-transforms.js';

describe('storage resolves', () => {
  let mockStore, state, storageB, alertIndicatorB;
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
      alertIndicatorB
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
});
