import angular from 'angular';
const {module, inject} = angular.mock;

import λ from 'highland';

describe('server resolves', () => {
  var jobMonitorStream, alertMonitorStream, socketStream,
    jobMonitor, alertMonitor, lnetStream, serversStream;

  beforeEach(module('server', ($provide) => {
    jobMonitorStream = λ();
    jobMonitor = jasmine.createSpy('jobMonitor')
      .and.returnValue(jobMonitorStream);
    $provide.value('jobMonitor', jobMonitor);

    alertMonitorStream = λ();
    alertMonitor = jasmine.createSpy('alertMonitor')
      .and.returnValue(alertMonitorStream);
    $provide.value('alertMonitor', alertMonitor);

    socketStream = jasmine.createSpy('socketStream')
      .and.callFake((path) => {
        if (path === '/lnet_configuration') {
          return (lnetStream = λ());
        }
        if (path === '/host') {
          return (serversStream = λ());
        }
      });
    $provide.value('socketStream', socketStream);
  }));

  var serverResolves;

  beforeEach(inject((_serverResolves_) => {
    serverResolves = _serverResolves_;
  }));

  it('should be a function', () => {
    expect(serverResolves).toEqual(jasmine.any(Function));
  });

  describe('getting a promise', () => {
    var $rootScope, promise;

    beforeEach(inject((_$rootScope_) => {
      $rootScope = _$rootScope_;

      promise = serverResolves();

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
      expect(socketStream)
        .toHaveBeenCalledOnceWith('/host', {
          jsonMask: 'objects(id,address,available_actions,boot_time,fqdn,immutable_state,install_method,label,\
locks,member_of_active_filesystem,needs_update,nodename,resource_uri,server_profile(ui_name,managed),state)',
          qs: { limit: 0 }
        });
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
          jobMonitorStream: jasmine.any(Object),
          alertMonitorStream: jasmine.any(Object),
          lnetConfigurationStream: jasmine.any(Object),
          serversStream: jasmine.any(Object)
        });
      });

      $rootScope.$apply();
    });
  });
});
