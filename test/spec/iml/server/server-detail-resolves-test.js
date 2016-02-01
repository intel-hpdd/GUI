import serverModule from '../../../../source/iml/server/server-module';
import highland from 'highland';


describe('server detail resolves', () => {
  var jobMonitor, alertMonitor,
    socketStream, getNetworkInterfaceStream,
    networkInterfaceStream, corosyncStream,
    pacemakerStream, lnetStream, serverStream,
    jobMonitorStream, alertMonitorStream, $route,
    serverDetailResolves;

  beforeEach(module(serverModule, $provide => {
    jobMonitorStream = highland();
    jobMonitor = jasmine.createSpy('jobMonitor')
      .and.returnValue(jobMonitorStream);
    $provide.value('jobMonitor', jobMonitor);

    alertMonitorStream = highland();
    alertMonitor = jasmine.createSpy('alertMonitor')
      .and.returnValue(alertMonitorStream);

    $provide.value('alertMonitor', alertMonitor);

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
      .and.callFake(function (path) {
        if (path.indexOf('/host/') !== -1)
          return (serverStream = highland());

        if (path === '/lnet_configuration/')
          return (lnetStream = highland());

        if (path === '/corosync_configuration')
          return (corosyncStream = highland());

        if (path === '/pacemaker_configuration')
          return (pacemakerStream = highland());
      });
    $provide.value('socketStream', socketStream);
  }));

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

      promise = serverDetailResolves();

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
      pacemakerStream.write({
        objects: []
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
        jsonMask: 'available_actions,resource_uri,address,fqdn,nodename,install_method,\
server_profile(ui_name,managed,initial_state),\
boot_time,state_modified_at,id,member_of_active_filesystem,locks,state'
      });
    });

    it('should create a lnet configuration stream', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/lnet_configuration/', {
        jsonMask: 'objects(available_actions,state,resource_uri,locks)',
        qs: {
          host__id: '1',
          limit: 0
        }
      });
    });

    it('should create a network interface stream', function () {
      expect(getNetworkInterfaceStream).toHaveBeenCalledOnceWith({
        jsonMask: 'objects(id,inet4_address,name,nid,lnd_types,resource_uri)',
        qs: {
          host__id: '1',
          limit: 0
        }
      });
    });

    it('should create a corosync configuration stream', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/corosync_configuration', {
        jsonMask: 'objects(resource_uri,available_actions,mcast_port,locks,state,id,network_interfaces)',
        qs: {
          host__id: '1',
          limit: 0
        }
      });
    });

    it('should create a pacemaker configuration stream', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/pacemaker_configuration', {
        jsonMask: 'objects(resource_uri,available_actions,locks,state,id)',
        qs: {
          host__id: '1',
          limit: 0
        }
      });
    });

    it('should return an object of streams', function () {
      var spy = jasmine.createSpy('spy');
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
