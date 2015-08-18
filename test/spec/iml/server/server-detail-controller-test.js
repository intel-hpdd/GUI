describe('server detail controller', function () {
  'use strict';

  beforeEach(module('server'));

  var $scope, serverDetailController, serverStream, alertMonitorStream,
    jobMonitorStream, overrideActionClick, networkInterfaceStream, lnetConfigurationStream,
    corosyncConfigurationStream;

  beforeEach(inject(function ($controller, $rootScope, addProperty) {
    $scope = $rootScope.$new();
    spyOn($scope, '$on');

    serverStream = highland()
      .map(function (x) {
        if (x instanceof Error)
          throw x;

        return x;
      });
    spyOn(serverStream, 'destroy');
    jobMonitorStream = highland();
    spyOn(jobMonitorStream, 'destroy');
    alertMonitorStream = highland();
    spyOn(alertMonitorStream, 'destroy');
    networkInterfaceStream = highland();
    spyOn(networkInterfaceStream, 'destroy');
    lnetConfigurationStream = highland().through(addProperty);
    spyOn(lnetConfigurationStream, 'destroy');
    corosyncConfigurationStream = highland();
    spyOn(corosyncConfigurationStream, 'destroy');

    overrideActionClick = function overrideActionClick () {};

    serverDetailController = $controller('ServerDetailController', {
      $scope: $scope,
      streams: {
        lnetConfigurationStream: lnetConfigurationStream,
        jobMonitorStream: jobMonitorStream,
        alertMonitorStream: alertMonitorStream,
        corosyncConfigurationStream: corosyncConfigurationStream,
        networkInterfaceStream: networkInterfaceStream,
        serverStream: serverStream
      },
      overrideActionClick: overrideActionClick,
    });
  }));

  it('should setup the controller', function () {
    expect(serverDetailController).toEqual({
      lnetConfigurationStream: lnetConfigurationStream,
      jobMonitorStream: jobMonitorStream,
      alertMonitorStream: alertMonitorStream,
      corosyncConfigurationStream: corosyncConfigurationStream,
      networkInterfaceStream: networkInterfaceStream,
      overrideActionClick: overrideActionClick,
      closeAlert: jasmine.any(Function),
      getAlert: jasmine.any(Function)
    });
  });

  it('should have a method to close the alert', function () {
    serverDetailController.closeAlert();

    expect(serverDetailController.alertClosed).toBeTruthy();
  });

  describe('writing data', function () {
    beforeEach(function () {
      serverStream.write({
        address: 'lotus-34vm5'
      });
    });

    it('should set it on the scope', function () {
      expect(serverDetailController.server).toEqual({ address: 'lotus-34vm5' });
    });

    it('should print an alert message', function () {
      expect(serverDetailController.getAlert()).toEqual('The information below describes the last state of lotus-34vm5 \
before it was removed.');
    });
  });

  it('should write lnet configuration data', function () {
    lnetConfigurationStream.write({
      foo: 'bar'
    });

    expect(serverDetailController.lnetConfiguration).toEqual({
      foo: 'bar'
    });
  });

  describe('writing an error', function () {
    var err;

    beforeEach(function () {
      err = new Error('boom!');
    });

    it('should set the remove property on 404', function () {
      err.statusCode = 404;
      serverStream.write(err);

      expect(serverDetailController.removed).toBeTruthy();
    });

    it('should re-push the error if not 404', function () {
      expect(function () {
        serverStream.write(err);
      })
        .toThrow(new Error('boom!'));
    });
  });

  describe('on destroy', function () {
    beforeEach(function () {
      $scope.$on.mostRecentCall.args[1]();
    });

    it('should destroy the server stream', function () {
      expect(serverStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the job monitor stream', function () {
      expect(jobMonitorStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the alert Monitor stream', function () {
      expect(alertMonitorStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the network interface stream', function () {
      expect(networkInterfaceStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the LNet configuration stream', function () {
      expect(lnetConfigurationStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the corosync configuration stream', function () {
      expect(corosyncConfigurationStream.destroy).toHaveBeenCalledOnce();
    });
  });
});
