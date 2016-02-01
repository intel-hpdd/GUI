import lnetModule from '../../../../source/iml/lnet/lnet-module';
import highland from 'highland';


describe('get network interface stream', function () {
  var socketStream, ss;

  beforeEach(module(lnetModule, function ($provide) {
    ss = highland();
    socketStream = jasmine.createSpy('socketStream')
      .and.returnValue(ss);
    spyOn(ss, 'write');

    $provide.value('socketStream', socketStream);
  }));

  var getNetworkInterfaceStream, stream;

  beforeEach(inject(function (_getNetworkInterfaceStream_) {
    getNetworkInterfaceStream = _getNetworkInterfaceStream_;
    stream = getNetworkInterfaceStream({
      qs: {
        host__id: '1'
      }
    });
  }));

  it('should be a function', function () {
    expect(getNetworkInterfaceStream).toEqual(jasmine.any(Function));
  });

  it('should return a stream', function () {
    expect(highland.isStream(stream)).toBe(true);
  });

  it('should send a get', function () {
    expect(socketStream).toHaveBeenCalledOnceWith('/network_interface', {
      qs: {
        host__id: '1'
      }
    });
  });

  it('should add a nid if missing', function () {
    var response = {
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

    stream.each(function (x) {
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
