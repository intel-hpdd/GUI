describe('server streams', () => {
  var jobMonitorStream, alertMonitorStream, getServersStream, socketStream,
    jobMonitor, alertMonitor, lnetStream, serversStream;

  beforeEach(module('server', ($provide) => {
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
      .andCallFake((path) => {
        if (path === '/lnet_configuration')
          return (lnetStream = highland());
      });
    $provide.value('socketStream', socketStream);
  }));

  var serverStreamsResolves;

  beforeEach(inject((_serverStreamsResolves_) => {
    serverStreamsResolves = _serverStreamsResolves_;
  }));

  it('should be a function', () => {
    expect(serverStreamsResolves).toEqual(jasmine.any(Function));
  });

  describe('getting a promise', () => {
    var $rootScope, promise;

    beforeEach(inject((_$rootScope_) => {
      $rootScope = _$rootScope_;

      promise = serverStreamsResolves();

      jobMonitorStream.write({});
      alertMonitorStream.write({});
      lnetStream.write({
        objects: []
      });
      serversStream.write({});

      $rootScope.$apply();
    }));

    it('should create a jobMonitorStream', () => {
      expect(jobMonitor).toHaveBeenCalledOnce();
    });

    it('should create an alertMonitorStream', () => {
      expect(alertMonitor).toHaveBeenCalledOnce();
    });

    it('should create a servers stream', () => {
      expect(getServersStream).toHaveBeenCalledOnce();
    });

    it('should create a lnet configuration stream', () => {
      expect(socketStream).toHaveBeenCalledOnceWith('/lnet_configuration', {
        jsonMask: 'objects(state,host,resource_uri)',
        qs: {
          dehydrate__host: false
        }
      });
    });

    it('should return an object of streams', () => {
      promise.then((streams) => {
        expect(streams).toEqual({
          serversStream: jasmine.any(Object),
          jobMonitorStream: jasmine.any(Object),
          alertMonitorStream: jasmine.any(Object),
          lnetConfigurationStream: jasmine.any(Object)
        });
      });

      $rootScope.$apply();
    });
  });
});
