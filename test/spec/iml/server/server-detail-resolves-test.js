import serverModule from '../../../../source/iml/server/server-module';
import highland from 'highland';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('server detail resolves', () => {
  var store, socketStream, getNetworkInterfaceStream,
    networkInterfaceStream, corosyncStream,
    pacemakerStream, lnetStream, serverStream,
    resolvesModule,
    $route, serverDetailResolves, spy;

  beforeEachAsync(async function () {
    store = {
      select: jasmine.createSpy('select')
          .and.callFake(key => {
            if (key === 'server')
              return (serverStream = highland());
            else if (key === 'lnetConfiguration')
              return (lnetStream = highland());
            else
              return highland();
          })
    };

    resolvesModule = await mock('source/iml/server/server-detail-resolves.js', {
      'source/iml/store/get-store': { default: store }
    });
  });

  afterEach(resetAll);

  beforeEach(module(serverModule, $provide => {
    spy = jasmine.createSpy('spy');

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
        if (path === '/corosync_configuration')
          return (corosyncStream = highland());

        if (path === '/pacemaker_configuration')
          return (pacemakerStream = highland());
      });
    $provide.value('socketStream', socketStream);

    $provide.factory('serverDetailResolves', resolvesModule.default);
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
      expect(store.select).toHaveBeenCalledOnceWith('jobIndicators');
    });

    it('should create an alertMonitorStream', () => {
      expect(store.select).toHaveBeenCalledOnceWith('alertIndicators');
    });

    it('should create a serverStream', () => {
      expect(store.select).toHaveBeenCalledOnceWith('server');
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
      expect(store.select).toHaveBeenCalledOnceWith('lnetConfiguration');
    });

    describe('filtering lnet configuration data', () => {
      beforeEach(() => {
        lnetStream.write([
          {
            id: '1',
            host: '/api/host/1/',
            state: 'lnet_up',
            resource_uri: '/api/lnet_configuration/1/',
            label: 'lnet configuration'
          }, {
            id: '2',
            host: '/api/host/2/',
            state: 'lnet_up',
            resource_uri: '/api/lnet_configuration/2/',
            label: 'lnet configuration'
          }
        ]);

        promise.then(resolves => {
          resolves.lnetConfigurationStream.each(spy);
        });
        $rootScope.$apply();
      });

      it('should return the item associated with the route', () => {
        expect(spy).toHaveBeenCalledOnceWith({
          id: '1',
          host: '/api/host/1/',
          state: 'lnet_up',
          resource_uri: '/api/lnet_configuration/1/',
          label: 'lnet configuration'
        });
      });

      it('should not return items not associated with the route', () => {
        expect(spy).not.toHaveBeenCalledWith({
          id: '2',
          host: '/api/host/2/',
          state: 'lnet_up',
          resource_uri: '/api/lnet_configuration/2/',
          label: 'lnet configuration'
        });
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
