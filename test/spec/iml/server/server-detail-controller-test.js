import highland from 'highland';
import ServerDetailController from '../../../../source/iml/server/server-detail-controller.js';
import angular from '../../../angular-mock-setup.js';
import broadcaster from '../../../../source/iml/broadcaster.js';

describe('server detail controller', () => {
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
    angular.mock.module($exceptionHandlerProvider => {
      $exceptionHandlerProvider.mode('log');
    })
  );

  beforeEach(
    inject(($rootScope, _$exceptionHandler_, propagateChange) => {
      $exceptionHandler = _$exceptionHandler_;

      $scope = $rootScope.$new();
      jest.spyOn($scope, '$on');

      serverStream = highland();
      jest.spyOn(serverStream, 'destroy');
      jobMonitorStream = highland();
      jest.spyOn(jobMonitorStream, 'destroy');
      alertMonitorStream = highland();
      jest.spyOn(alertMonitorStream, 'destroy');
      networkInterfaceStream = highland();
      jest.spyOn(networkInterfaceStream, 'destroy');
      lnetConfigurationStream = highland();
      jest.spyOn(lnetConfigurationStream, 'destroy');
      corosyncConfigurationStream = highland();
      jest.spyOn(corosyncConfigurationStream, 'destroy');
      pacemakerConfigurationStream = highland();
      jest.spyOn(pacemakerConfigurationStream, 'destroy');

      overrideActionClick = () => {};

      serverDetailController = {};

      ServerDetailController.bind(serverDetailController)(
        $scope,
        {
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
        overrideActionClick,
        propagateChange
      );
    })
  );

  it('should setup the controller', () => {
    const instance = {
      ...serverDetailController,
      ...{
        lnetConfigurationStream: expect.any(Function),
        jobMonitorStream: expect.any(Function),
        alertMonitorStream: expect.any(Function),
        corosyncConfigurationStream: expect.any(Function),
        pacemakerConfigurationStream: expect.any(Function),
        networkInterfaceStream: networkInterfaceStream,
        overrideActionClick
      }
    };

    expect(serverDetailController).toEqual(instance);
  });

  describe('writing data', () => {
    beforeEach(() => {
      serverStream.write({
        address: 'lotus-34vm5'
      });
    });

    it('should set it on the scope', () => {
      expect(serverDetailController.server).toEqual({ address: 'lotus-34vm5' });
    });
  });

  it('should write lnet configuration data', () => {
    lnetConfigurationStream.write({
      foo: 'bar'
    });

    expect(serverDetailController.lnetConfiguration).toEqual({
      foo: 'bar'
    });
  });

  describe('writing an error', () => {
    let err;

    beforeEach(() => {
      err = new Error('boom!');
    });

    it('should write null on 404', () => {
      err.statusCode = 404;
      serverStream.write({
        __HighlandStreamError__: true,
        error: err
      });

      expect(serverDetailController.server).toEqual(null);
    });

    it('should re-push the error if not 404', () => {
      serverStream.write({
        __HighlandStreamError__: true,
        error: err
      });

      expect($exceptionHandler.errors).toEqual([new Error('boom!')]);
    });
  });

  describe('on destroy', () => {
    beforeEach(() => {
      $scope.$on.mock.calls[0][1]();
    });

    it('should destroy the server stream', () => {
      expect(serverStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should destroy the job monitor stream', () => {
      expect(jobMonitorStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should destroy the alert Monitor stream', () => {
      expect(alertMonitorStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should destroy the network interface stream', () => {
      expect(networkInterfaceStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should destroy the LNet configuration stream', () => {
      expect(lnetConfigurationStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should destroy the corosync configuration stream', () => {
      expect(corosyncConfigurationStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should destroy the pacemaker configuration stream', () => {
      expect(pacemakerConfigurationStream.destroy).toHaveBeenCalledTimes(1);
    });
  });
});
