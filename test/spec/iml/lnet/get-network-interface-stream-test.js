import highland from 'highland';

import { mock, resetAll } from '../../../system-mock.js';

describe('get network interface stream', function() {
  let socketStream, ss, getNetworkInterfaceStream, stream;

  beforeEachAsync(async function() {
    ss = highland();
    socketStream = jasmine.createSpy('socketStream').and.returnValue(ss);
    spyOn(ss, 'write');

    const mod = await mock('source/iml/lnet/get-network-interface-stream.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });

    getNetworkInterfaceStream = mod.default;

    stream = getNetworkInterfaceStream({
      qs: {
        host__id: '1'
      }
    });
  });

  afterEach(resetAll);

  it('should be a function', function() {
    expect(getNetworkInterfaceStream).toEqual(expect.any(Function));
  });

  it('should return a stream', function() {
    expect(highland.isStream(stream)).toBe(true);
  });

  it('should send a get', function() {
    expect(socketStream).toHaveBeenCalledOnceWith('/network_interface', {
      qs: {
        host__id: '1'
      }
    });
  });

  it('should add a nid if missing', function() {
    const response = {
      objects: [
        {
          resource_uri: '/api/network_interface/1'
        },
        {
          resource_uri: '/api/network_interface/2',
          nid: {
            lnd_network: 1,
            network_interface: '/api/network_interface/2'
          }
        }
      ]
    };

    ss.write(response);

    stream.each(function(x) {
      expect(x).toEqual([
        {
          resource_uri: '/api/network_interface/1',
          nid: {
            lnd_network: -1,
            network_interface: '/api/network_interface/1'
          }
        },
        {
          resource_uri: '/api/network_interface/2',
          nid: {
            lnd_network: 1,
            network_interface: '/api/network_interface/2'
          }
        }
      ]);
    });
  });
});
