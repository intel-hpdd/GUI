describe('server detail resolves', function () {
  'use strict';

  var jobMonitor, alertMonitor,
    socketStream, getNetworkInterfaceStream,
    networkInterfaceStream, corosyncStream,
    lnetStream, serverStream, jobMonitorStream, alertMonitorStream;

  beforeEach(module('server', function ($provide) {
    jobMonitorStream = highland();
    jobMonitor = jasmine.createSpy('jobMonitor')
      .andReturn(jobMonitorStream);
    $provide.value('jobMonitor', jobMonitor);

    alertMonitorStream = highland();
    alertMonitor = jasmine.createSpy('alertMonitor')
      .andReturn(alertMonitorStream);

    $provide.value('alertMonitor', alertMonitor);

    networkInterfaceStream = highland();

    getNetworkInterfaceStream = jasmine.createSpy('getNetworkInterfaceStream')
      .andReturn(networkInterfaceStream);
    $provide.value('getNetworkInterfaceStream', getNetworkInterfaceStream);

    socketStream = jasmine.createSpy('socketStream')
      .andCallFake(function (path) {
        if (path.indexOf('/host/') !== -1)
          return (serverStream = highland());

        if (path === '/lnet_configuration/')
          return (lnetStream = highland());

        if (path === '/corosync_configuration')
          return (corosyncStream = highland());
      });
    $provide.value('socketStream', socketStream);
  }));

  var serverDetailResolves;

  beforeEach(inject(function (_serverDetailResolves_) {
    serverDetailResolves = _serverDetailResolves_;
  }));

  it('should be a function', function () {
    expect(serverDetailResolves).toEqual(jasmine.any(Function));
  });

  describe('getting a promise', function () {
    var $rootScope, promise;

    beforeEach(inject(function (_$rootScope_) {
      $rootScope = _$rootScope_;

      promise = serverDetailResolves({
        current: {
          params: {
            id: '1'
          }
        }
      });

      jobMonitorStream.write({});
      alertMonitorStream.write({});
      serverStream.write({});
      lnetStream.write({
        objects: []
      });
      networkInterfaceStream.write({});
      corosyncStream.write({
        objects: [{}]
      });

      $rootScope.$apply();
    }));

    it('should create a jobMonitorStream', function () {
      expect(jobMonitor).toHaveBeenCalledOnce();
    });

    it('should create an alertMonitorStream', function () {
      expect(alertMonitor).toHaveBeenCalledOnce();
    });

    it('should create a host stream', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/host/1', {
        jsonMask: 'available_actions,resource_uri,address,fqdn,nodename,server_profile/ui_name,\
boot_time,state_modified_at,id,member_of_active_filesystem,locks,state'
      });
    });

    it('should create a lnet configuration stream', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/lnet_configuration/', {
        jsonMask: 'objects(available_actions,state,host/id,resource_uri,locks)',
        qs: {
          host__id: '1',
          limit: 0
        }
      });
    });

    it('should create a network interface stream', function () {
      expect(getNetworkInterfaceStream).toHaveBeenCalledOnceWith({
        jsonMask: 'objects(id,inet4_address,name,nid,lnd_types)',
        qs: {
          host__id: '1',
          limit: 0
        }
      });
    });

    it('should create a corosync configuration stream', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/corosync_configuration', {
        jsonMask: 'objects(resource_uri,available_actions,mcast_port,locks,state,id)',
        qs: {
          host__id: '1',
          limit: 0
        }
      });
    });

    it('should return an object of streams', function () {
      promise.then(function (streams) {
        expect(streams).toEqual({
          jobMonitorStream: jasmine.any(Object),
          alertMonitorStream: jasmine.any(Object),
          serverStream: jasmine.any(Object),
          lnetConfigurationStream: jasmine.any(Object),
          networkInterfaceStream: jasmine.any(Object),
          corosyncConfigurationStream: jasmine.any(Object)
        });
      });

      $rootScope.$apply();
    });
  });
});
