describe('server streams', function () {
  'use strict';

  var jobMonitorStream, alertMonitorStream, getServersStream, socketStream,
    jobMonitor, alertMonitor, lnetStream, corosyncStream, serversStream;

  beforeEach(module('server', function ($provide) {
    jobMonitorStream = highland();
    jobMonitor = jasmine.createSpy('jobMonitor')
      .andReturn(jobMonitorStream);
    $provide.value('jobMonitor', jobMonitor);

    alertMonitorStream = highland();
    alertMonitor = jasmine.createSpy('alertMonitor')
      .andReturn(alertMonitorStream);
    $provide.value('alertMonitor', alertMonitor);

    serversStream = highland();
    getServersStream = jasmine.createSpy('getServersStream')
      .andReturn(serversStream);
    $provide.value('getServersStream', getServersStream);

    socketStream = jasmine.createSpy('socketStream')
      .andCallFake(function (path) {
        if (path === '/lnet_configuration')
          return (lnetStream = highland());

        if (path === '/corosync_configuration')
          return (corosyncStream = highland());
      });
    $provide.value('socketStream', socketStream);
  }));

  var serverStreamsResolves;

  beforeEach(inject(function (_serverStreamsResolves_) {
    serverStreamsResolves = _serverStreamsResolves_;
  }));

  it('should be a function', function () {
    expect(serverStreamsResolves).toEqual(jasmine.any(Function));
  });

  describe('getting a promise', function () {
    var $rootScope, promise;

    beforeEach(inject(function (_$rootScope_) {
      $rootScope = _$rootScope_;

      promise = serverStreamsResolves();

      jobMonitorStream.write({});
      alertMonitorStream.write({});
      lnetStream.write({
        objects: []
      });
      corosyncStream.write({
        objects: [{}]
      });
      serversStream.write({});

      $rootScope.$apply();
    }));

    it('should create a jobMonitorStream', function () {
      expect(jobMonitor).toHaveBeenCalledOnce();
    });

    it('should create an alertMonitorStream', function () {
      expect(alertMonitor).toHaveBeenCalledOnce();
    });

    it('should create a servers stream', function () {
      expect(getServersStream).toHaveBeenCalledOnce();
    });

    it('should create a lnet configuration stream', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/lnet_configuration', {
        jsonMask: 'objects(state,host,resource_uri)',
        qs: {
          dehydrate__host: false
        }
      });
    });

    it('should create a corosync configuration stream', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/corosync_configuration', {
        jsonMask: 'objects(state,host,resource_uri)',
        qs: {
          limit: 0
        }
      });
    });

    it('should return an object of streams', function () {
      promise.then(function (streams) {
        expect(streams).toEqual({
          serversStream: jasmine.any(Object),
          jobMonitorStream: jasmine.any(Object),
          alertMonitorStream: jasmine.any(Object),
          lnetConfigurationStream: jasmine.any(Object),
          corosyncConfigurationStream: jasmine.any(Object)
        });
      });

      $rootScope.$apply();
    });
  });
});
