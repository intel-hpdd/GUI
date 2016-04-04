import serverModule from '../../../../source/iml/server/server-module';
import highland from 'highland';


describe('server detail resolves', () => {
  var getStore, socketStream, getNetworkInterfaceStream,
    networkInterfaceStream, corosyncStream,
    pacemakerStream, lnetStream, serverStream,
    $route, serverDetailResolves, spy;

  beforeEach(module(serverModule, $provide => {
    spy = jasmine.createSpy('spy');
    getStore = {
      select: jasmine.createSpy('select')
        .and.callFake(key => {
          if (key === 'server')
            return (serverStream = highland());
          else
            return highland();
        })
    };
    $provide.value('getStore', getStore);

    $route = {
      current: {
        params: {
          id: '1'
        }
      }
    };
    $provide.value('$route', $route);

    networkInterfaceStream = highland();

    getNetworkInterfaceStream = jasmine.createSpy('getNetworkInterfaceStream')
      .and.returnValue(networkInterfaceStream);
    $provide.value('getNetworkInterfaceStream', getNetworkInterfaceStream);

    socketStream = jasmine.createSpy('socketStream')
      .and.callFake(path => {
        if (path === '/lnet_configuration/')
          return (lnetStream = highland());

        if (path === '/corosync_configuration')
          return (corosyncStream = highland());

        if (path === '/pacemaker_configuration')
          return (pacemakerStream = highland());
      });
    $provide.value('socketStream', socketStream);
  }));

  beforeEach(inject(_serverDetailResolves_ => {
    serverDetailResolves = _serverDetailResolves_;
  }));

  it('should be a function', () => {
    expect(serverDetailResolves).toEqual(jasmine.any(Function));
  });

  describe('getting a promise', () => {
    var $rootScope, promise;

    beforeEach(inject(_$rootScope_ => {
      $rootScope = _$rootScope_;

      promise = serverDetailResolves();

      serverStream.write({});
      lnetStream.write({
        objects: []
      });
      networkInterfaceStream.write({});
      corosyncStream.write({
        objects: [{}]
      });
      pacemakerStream.write({
        objects: []
      });

      $rootScope.$apply();
    }));

    it('should create a jobMonitorStream', () => {
      expect(getStore.select).toHaveBeenCalledOnceWith('jobIndicators');
    });

    it('should create an alertMonitorStream', () => {
      expect(getStore.select).toHaveBeenCalledOnceWith('alertIndicators');
    });

    it('should create a serverStream', () => {
      expect(getStore.select).toHaveBeenCalledOnceWith('server');
    });

    describe('filtering server data', () => {
      beforeEach(() => {
        serverStream.write([
          {
            id: '1',
            address: 'lotus-35vm15.lotus.hpdd.lab.intel.com'
          }, {
            id: '2',
            address: 'lotus-35vm16.lotus.hpdd.lab.intel.com'
          }
        ]);

        promise.then(resolves => {
          resolves.serverStream.each(spy);
        });
        $rootScope.$apply();
      });

      it('should return the server associated with the route', () => {
        expect(spy).toHaveBeenCalledOnceWith({
          id: '1',
          address: 'lotus-35vm15.lotus.hpdd.lab.intel.com'
        });
      });

      it('should not return servers which have an id that does not match the route', () => {
        expect(spy).not.toHaveBeenCalledWith({
          id: '2',
          address: 'lotus-35vm16.lotus.hpdd.lab.intel.com'
        });
      });
    });

    it('should create a lnet configuration stream', () => {
      expect(socketStream).toHaveBeenCalledOnceWith('/lnet_configuration/', {
        jsonMask: 'objects(available_actions,state,resource_uri,locks)',
        qs: {
          host__id: '1',
          limit: 0
        }
      });
    });

    it('should create a network interface stream', () => {
      expect(getNetworkInterfaceStream).toHaveBeenCalledOnceWith({
        jsonMask: 'objects(id,inet4_address,name,nid,lnd_types,resource_uri)',
        qs: {
          host__id: '1',
          limit: 0
        }
      });
    });

    it('should create a corosync configuration stream', () => {
      expect(socketStream).toHaveBeenCalledOnceWith('/corosync_configuration', {
        jsonMask: 'objects(resource_uri,available_actions,mcast_port,locks,state,id,network_interfaces)',
        qs: {
          host__id: '1',
          limit: 0
        }
      });
    });

    it('should create a pacemaker configuration stream', () => {
      expect(socketStream).toHaveBeenCalledOnceWith('/pacemaker_configuration', {
        jsonMask: 'objects(resource_uri,available_actions,locks,state,id)',
        qs: {
          host__id: '1',
          limit: 0
        }
      });
    });

    it('should return an object of streams', () => {
      promise.then(spy);

      $rootScope.$apply();

      expect(spy.calls.mostRecent().args[0]).toEqual({
        jobMonitorStream: jasmine.any(Object),
        alertMonitorStream: jasmine.any(Object),
        serverStream: jasmine.any(Object),
        lnetConfigurationStream: jasmine.any(Object),
        networkInterfaceStream: jasmine.any(Object),
        corosyncConfigurationStream: jasmine.any(Object),
        pacemakerConfigurationStream: jasmine.any(Object)
      });
    });
  });
});
