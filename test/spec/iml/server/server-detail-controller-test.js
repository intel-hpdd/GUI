import serverModule from '../../../../source/iml/server/server-module';
import highland from 'highland';
import ServerDetailController
  from '../../../../source/iml/server/server-detail-controller';
import broadcaster from '../../../../source/iml/broadcaster.js';

describe('server detail controller', function() {
  beforeEach(
    module(serverModule, $exceptionHandlerProvider => {
      $exceptionHandlerProvider.mode('log');
    })
  );

  let $scope,
    serverDetailController,
    serverStream,
    alertMonitorStream,
    jobMonitorStream,
    overrideActionClick,
    $exceptionHandler,
    networkInterfaceStream,
    lnetConfigurationStream,
    pacemakerConfigurationStream,
    corosyncConfigurationStream;

  beforeEach(
    inject(($controller, $rootScope, _$exceptionHandler_) => {
      $exceptionHandler = _$exceptionHandler_;

      $scope = $rootScope.$new();
      spyOn($scope, '$on');

      serverStream = highland();
      spyOn(serverStream, 'destroy');
      jobMonitorStream = highland();
      spyOn(jobMonitorStream, 'destroy');
      alertMonitorStream = highland();
      spyOn(alertMonitorStream, 'destroy');
      networkInterfaceStream = highland();
      spyOn(networkInterfaceStream, 'destroy');
      lnetConfigurationStream = highland();
      spyOn(lnetConfigurationStream, 'destroy');
      corosyncConfigurationStream = highland();
      spyOn(corosyncConfigurationStream, 'destroy');
      pacemakerConfigurationStream = highland();
      spyOn(pacemakerConfigurationStream, 'destroy');

      overrideActionClick = function overrideActionClick() {};

      serverDetailController = $controller('ServerDetailController', {
        $scope: $scope,
        streams: {
          lnetConfigurationStream: broadcaster(lnetConfigurationStream),
          jobMonitorStream: broadcaster(jobMonitorStream),
          alertMonitorStream: broadcaster(alertMonitorStream),
          corosyncConfigurationStream: broadcaster(corosyncConfigurationStream),
          pacemakerConfigurationStream: broadcaster(
            pacemakerConfigurationStream
          ),
          networkInterfaceStream,
          serverStream
        },
        overrideActionClick
      });
    })
  );

  it('should setup the controller', function() {
    const instance = window.extendWithConstructor(ServerDetailController, {
      lnetConfigurationStream: expect.any(Function),
      jobMonitorStream: expect.any(Function),
      alertMonitorStream: expect.any(Function),
      corosyncConfigurationStream: expect.any(Function),
      pacemakerConfigurationStream: expect.any(Function),
      networkInterfaceStream: networkInterfaceStream,
      overrideActionClick
    });

    expect(serverDetailController).toEqual(instance);
  });

  describe('writing data', function() {
    beforeEach(function() {
      serverStream.write({
        address: 'lotus-34vm5'
      });
    });

    it('should set it on the scope', function() {
      expect(serverDetailController.server).toEqual({ address: 'lotus-34vm5' });
    });
  });

  it('should write lnet configuration data', function() {
    lnetConfigurationStream.write({
      foo: 'bar'
    });

    expect(serverDetailController.lnetConfiguration).toEqual({
      foo: 'bar'
    });
  });

  describe('writing an error', function() {
    let err;

    beforeEach(function() {
      err = new Error('boom!');
    });

    it('should write null on 404', function() {
      err.statusCode = 404;
      serverStream.write({
        __HighlandStreamError__: true,
        error: err
      });

      expect(serverDetailController.server).toEqual(null);
    });

    it('should re-push the error if not 404', function() {
      serverStream.write({
        __HighlandStreamError__: true,
        error: err
      });

      expect($exceptionHandler.errors).toEqual([new Error('boom!')]);
    });
  });

  describe('on destroy', function() {
    beforeEach(function() {
      $scope.$on.calls.mostRecent().args[1]();
    });

    it('should destroy the server stream', function() {
      expect(serverStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should destroy the job monitor stream', function() {
      expect(jobMonitorStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should destroy the alert Monitor stream', function() {
      expect(alertMonitorStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should destroy the network interface stream', function() {
      expect(networkInterfaceStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should destroy the LNet configuration stream', function() {
      expect(lnetConfigurationStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should destroy the corosync configuration stream', function() {
      expect(corosyncConfigurationStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should destroy the pacemaker configuration stream', function() {
      expect(pacemakerConfigurationStream.destroy).toHaveBeenCalledTimes(1);
    });
  });
});
