import highland from 'highland';
describe('get network interface stream', () => {
  let mockSocketStream, ss, getNetworkInterfaceStream, stream;
  beforeEach(() => {
    jest.resetModules();
    ss = highland();
    mockSocketStream = jest.fn(() => ss);
    jest.spyOn(ss, 'write');
    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockSocketStream
    );

    const mod = require('../../../../source/iml/lnet/get-network-interface-stream.js');
    getNetworkInterfaceStream = mod.default;
    stream = getNetworkInterfaceStream({ qs: { host__id: '1' } });
  });

  afterEach(() => {
    window.angular = null;
  });

  it('should be a function', () => {
    expect(getNetworkInterfaceStream).toEqual(expect.any(Function));
  });
  it('should return a stream', () => {
    expect(highland.isStream(stream)).toBe(true);
  });
  it('should send a get', () => {
    expect(mockSocketStream).toHaveBeenCalledOnceWith('/network_interface', {
      qs: { host__id: '1' }
    });
  });
  it('should add a nid if missing', () => {
    const response = {
      objects: [
        {
          resource_uri: '/api/network_interface/1',
          lnd_types: ['o2ib', 'tcp']
        },
        {
          resource_uri: '/api/network_interface/2',
          nid: {
            lnd_type: 'tcp',
            lnd_network: 1,
            network_interface: '/api/network_interface/2'
          },
          lnd_types: ['o2ib', 'tcp']
        }
      ]
    };
    ss.write(response);
    stream.each(x => {
      expect(x).toEqual([
        {
          resource_uri: '/api/network_interface/1',
          nid: {
            lnd_type: 'o2ib',
            lnd_network: -1,
            network_interface: '/api/network_interface/1'
          },
          lnd_types: ['o2ib', 'tcp']
        },
        {
          resource_uri: '/api/network_interface/2',
          nid: {
            lnd_type: 'tcp',
            lnd_network: 1,
            network_interface: '/api/network_interface/2'
          },
          lnd_types: ['o2ib', 'tcp']
        }
      ]);
    });
  });
});
