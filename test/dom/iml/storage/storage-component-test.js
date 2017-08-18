// @flow

import Inferno from 'inferno';
import highland, { type HighlandStreamT } from 'highland';
import broadcaster from '../../../../source/iml/broadcaster.js';
import type { State } from '../../../../source/iml/storage/storage-reducer.js';
import { renderToSnapshot } from '../../../test-utils.js';

describe('storage component', () => {
  let StorageComponent,
    mockStore,
    storage$: HighlandStreamT<State>,
    alertIndicator$: HighlandStreamT<Object[]>;

  beforeEach(() => {
    mockStore = { dispatch: jest.fn() };
    jest.mock('../../../../source/iml/store/get-store.js', () => mockStore);

    const mockStorageResources = jest.fn(() => highland([]));
    jest.mock(
      '../../../../source/iml/storage/storage-resources.js',
      () => mockStorageResources
    );

    ({
      StorageComponent
    } = require('../../../../source/iml/storage/storage-component.js'));

    storage$ = highland();
    alertIndicator$ = highland();
  });

  it('should render no plugins', () => {
    storage$.write({
      config: {
        sortDesc: false,
        sortKey: 'name',
        loading: false,
        selectIndex: 0,
        entries: 10,
        offset: 0
      },
      resourceClasses: [],
      resources: {
        meta: {
          limit: 10,
          next: null,
          offset: 0,
          previous: null,
          total_count: 0
        },
        objects: []
      }
    });

    expect(
      renderToSnapshot(
        <StorageComponent
          viewer={broadcaster(storage$)}
          alertIndicatorB={broadcaster(alertIndicator$)}
        />
      )
    ).toMatchSnapshot();
  });

  it('should render with plugins', () => {
    storage$.write({
      config: {
        sortDesc: false,
        sortKey: 'name',
        loading: true,
        selectIndex: 0,
        entries: 1,
        offset: 0
      },
      resourceClasses: [
        {
          class_name: 'EMCPower',
          columns: [
            {
              label: 'Size',
              name: 'size'
            },
            {
              label: 'Filesystem type',
              name: 'filesystem_type'
            },
            {
              label: 'Uuid',
              name: 'uuid'
            }
          ],
          fields: [
            {
              class: 'Bytes',
              label: 'Size',
              name: 'size',
              optional: false,
              user_read_only: false
            },
            {
              class: 'Boolean',
              label: 'Filesystem type',
              name: 'filesystem_type',
              optional: true,
              user_read_only: false
            },
            {
              class: 'String',
              label: 'Uuid',
              name: 'uuid',
              optional: false,
              user_read_only: false
            }
          ],
          id: 1,
          label: 'linux-EMCPower',
          modified_at: '2017-07-19T13:58:02.615410',
          plugin_internal: true,
          plugin_name: 'linux',
          resource_uri: '/api/storage_resource_class/1/',
          user_creatable: false
        }
      ],
      resources: {
        meta: {
          limit: 10,
          next: null,
          offset: 0,
          previous: null,
          total_count: 1
        },
        objects: []
      }
    });

    expect(
      renderToSnapshot(
        <StorageComponent
          viewer={broadcaster(storage$)}
          alertIndicatorB={broadcaster(alertIndicator$)}
        />
      )
    ).toMatchSnapshot();
  });
});
