// @flow

import Inferno from 'inferno';
import highland from 'highland';
import broadcaster from '../../../../source/iml/broadcaster.js';
import { renderToSnapshot } from '../../../test-utils.js';
import { querySelector } from '../../../../source/iml/dom-utils.js';

describe('ResourceTable DOM tests', () => {
  let ResourceTable, resourceClass, resources, alertIndicatorB, mockStore;

  beforeEach(() => {
    resourceClass = {
      class_name: 'HostNetworkInterface',
      columns: [
        { label: 'Host id', name: 'host_id' },
        { label: 'Name', name: 'name' },
        { label: 'Inet4 address', name: 'inet4_address' },
        { label: 'Inet4 prefix', name: 'inet4_prefix' },
        { label: 'Type', name: 'type' },
        { label: 'Up', name: 'up' }
      ],
      fields: [
        {
          class: 'Integer',
          label: 'Host id',
          name: 'host_id',
          optional: false,
          user_read_only: false
        },
        {
          class: 'String',
          label: 'Name',
          name: 'name',
          optional: false,
          user_read_only: false
        },
        {
          class: 'String',
          label: 'Inet4 address',
          name: 'inet4_address',
          optional: false,
          user_read_only: false
        },
        {
          class: 'Integer',
          label: 'Inet4 prefix',
          name: 'inet4_prefix',
          optional: false,
          user_read_only: false
        },
        {
          class: 'String',
          label: 'Type',
          name: 'type',
          optional: false,
          user_read_only: false
        },
        {
          class: 'Boolean',
          label: 'Up',
          name: 'up',
          optional: false,
          user_read_only: false
        }
      ],
      id: 14,
      label: 'linux_network-HostNetworkInterface',
      modified_at: '2017-07-19T13:58:03.413762',
      plugin_internal: true,
      plugin_name: 'linux_network',
      resource_uri: '/api/storage_resource_class/14/',
      user_creatable: false
    };

    resources = {
      meta: {
        limit: 10,
        next: '/api/storage_resource/?limit=10&offset=10',
        offset: 0,
        previous: null,
        total_count: 16
      },
      objects: [
        {
          alerts: [],
          alias: "HostNetworkInterface (10, u'enp0s10')",
          attributes: {
            host_id: {
              class: 'Integer',
              label: 'Host id',
              markup: '10',
              raw: 10
            },
            inet4_address: {
              class: 'ResourceReference',
              label: 'Inet4 address',
              markup: '<p>10.128.0.12</p>',
              raw: '/api/foo/1'
            },
            inet4_prefix: {
              class: 'Integer',
              label: 'Inet4 prefix',
              markup: '24',
              raw: 24
            },
            name: {
              class: 'String',
              label: 'Name',
              markup: 'enp0s10',
              raw: 'enp0s10'
            },
            type: { class: 'String', label: 'Type', markup: 'tcp', raw: 'tcp' },
            up: { class: 'Boolean', label: 'Up', markup: 'True', raw: true }
          },
          charts: [
            { series: ['tx_bytes'], title: 'tx_bytes' },
            { series: ['rx_bytes'], title: 'rx_bytes' }
          ],
          class_name: 'HostNetworkInterface',
          default_alias: "HostNetworkInterface (10, u'enp0s10')",
          deletable: false,
          id: 2,
          modified_at: '2017-07-19T14:23:30.678061',
          parent_classes: null,
          plugin_name: 'linux_network',
          propagated_alerts: [],
          resource_uri: '/api/storage_resource/2/',
          stats: {
            rx_bytes: {
              data: null,
              label: 'rx_bytes',
              name: 'rx_bytes',
              type: 'timeseries',
              unit_name: 'Bytes/s'
            },
            tx_bytes: {
              data: null,
              label: 'tx_bytes',
              name: 'tx_bytes',
              type: 'timeseries',
              unit_name: 'Bytes/s'
            }
          },
          storage_id_str: '[10, "enp0s10"]'
        },
        {
          alerts: [],
          alias: "HostNetworkInterface (10, u'enp0s3')",
          attributes: {
            host_id: {
              class: 'Integer',
              label: 'Host id',
              markup: '10',
              raw: 10
            },
            inet4_address: {
              class: 'String',
              label: 'Inet4 address',
              markup: '10.0.2.15',
              raw: '10.0.2.15'
            },
            inet4_prefix: {
              class: 'Integer',
              label: 'Inet4 prefix',
              markup: '24',
              raw: 24
            },
            name: {
              class: 'String',
              label: 'Name',
              markup: 'enp0s3',
              raw: 'enp0s3'
            },
            type: { class: 'String', label: 'Type', markup: 'tcp', raw: 'tcp' },
            up: { class: 'Boolean', label: 'Up', markup: 'True', raw: true }
          },
          charts: [
            { series: ['tx_bytes'], title: 'tx_bytes' },
            { series: ['rx_bytes'], title: 'rx_bytes' }
          ],
          class_name: 'HostNetworkInterface',
          default_alias: "HostNetworkInterface (10, u'enp0s3')",
          deletable: false,
          id: 3,
          modified_at: '2017-07-19T14:23:30.695521',
          parent_classes: null,
          plugin_name: 'linux_network',
          propagated_alerts: [],
          resource_uri: '/api/storage_resource/3/',
          stats: {
            rx_bytes: {
              data: null,
              label: 'rx_bytes',
              name: 'rx_bytes',
              type: 'timeseries',
              unit_name: 'Bytes/s'
            },
            tx_bytes: {
              data: null,
              label: 'tx_bytes',
              name: 'tx_bytes',
              type: 'timeseries',
              unit_name: 'Bytes/s'
            }
          },
          storage_id_str: '[10, "enp0s3"]'
        }
      ]
    };

    alertIndicatorB = broadcaster(highland([[]]));

    mockStore = jest.genMockFromModule(
      '../../../../source/iml/store/get-store.js'
    ).default;

    jest.mock('../../../../source/iml/store/get-store.js', () => mockStore);

    ({
      ResourceTable
    } = require('../../../../source/iml/storage/resource-table.js'));
  });

  it('should render without data', () => {
    resources.objects = [];

    expect(
      renderToSnapshot(
        <ResourceTable
          resourceClass={resourceClass}
          resources={resources}
          sortKey=""
          sortDesc={false}
          entries={10}
          alertIndicatorB={alertIndicatorB}
        />
      )
    ).toMatchSnapshot();
  });

  describe('with data', () => {
    let root;

    beforeEach(() => {
      root = document.createElement('div');
      querySelector(document, 'body').appendChild(root);

      Inferno.render(
        <ResourceTable
          resourceClass={resourceClass}
          resources={resources}
          sortKey=""
          sortDesc={false}
          entries={10}
          alertIndicatorB={alertIndicatorB}
        />,
        root
      );
    });

    afterEach(() => {
      querySelector(document, 'body').removeChild(root);
    });

    it('should render with data', () => {
      expect(root).toMatchSnapshot();
    });

    it('should dispatch a sort change', () => {
      querySelector(root, 'th a').click();

      expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
        payload: { loading: true, sortDesc: true, sortKey: 'host_id' },
        type: 'SET_STORAGE_CONFIG'
      });
    });

    it('should dispatch an entries change', () => {
      querySelector(root, '.btn-info').click();
      root.querySelectorAll('li a')[1].click();

      expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
        payload: { entries: 25, loading: true },
        type: 'SET_STORAGE_CONFIG'
      });
    });

    it('should dispatch an offset change', () => {
      querySelector(root, '.pagination-next a').click();

      expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
        payload: { loading: true, offset: 10 },
        type: 'SET_STORAGE_CONFIG'
      });
    });
  });
});
