import angular from '../../../angular-mock-setup.js';
import highland from 'highland';

import networkInterfaceDataFixtures
  from '../../../data-fixtures/network-interface-fixtures.json';

describe('Configure LNet', () => {
  let $scope,
    ctrl,
    networkInterfaceStream,
    ss,
    insertHelpFilter,
    mockSocketStream,
    networkInterfaceResponse,
    waitForCommandCompletion,
    waitForCommandCompletionResponse,
    mod,
    ConfigureLnetController,
    LNET_OPTIONS;

  beforeEach(() => {

    ss = highland();
    mockSocketStream = jest.fn(() => ss);

    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockSocketStream
    );
    mod = require('../../../../source/iml/lnet/configure-lnet.js');

    ConfigureLnetController = mod.ConfigureLnetController;
  });

  describe('Controller', () => {
    beforeEach(
      angular.mock.inject(($rootScope, propagateChange) => {
        waitForCommandCompletionResponse = jest.fn(response =>
          highland([response])
        );
        waitForCommandCompletion = jest.fn(
          () => waitForCommandCompletionResponse
        );

        networkInterfaceResponse = angular.copy(
          networkInterfaceDataFixtures.in[0]
        );

        $scope = $rootScope.$new();

        networkInterfaceStream = highland();
        jest.spyOn(networkInterfaceStream, 'destroy');

        jest.spyOn($scope, '$on');

        insertHelpFilter = jest.fn();

        LNET_OPTIONS = [
          { name: 'Not Lustre Network', value: -1 },
          { name: 'Lustre Network 0', value: 0 },
          { name: 'Lustre Network 1', value: 1 },
          { name: 'Lustre Network 2', value: 2 }
        ];

        ctrl = {
          networkInterfaceStream
        };

        ConfigureLnetController.bind(ctrl)(
          $scope,
          LNET_OPTIONS,
          insertHelpFilter,
          waitForCommandCompletion,
          propagateChange
        );

        jest.useFakeTimers();
      })
    );

    afterEach(() => {
      jest.clearAllTimers();
      jest.useRealTimers();
    });

    it('should listen for $destroy', () => {
      expect($scope.$on).toHaveBeenCalledOnceWith(
        '$destroy',
        expect.any(Function)
      );
    });

    it('should end the network interface stream on destroy', () => {
      $scope.$on.mock.calls[0][1]();

      expect(networkInterfaceStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should setup the controller as expected', () => {
      expect(ctrl).toEqual({
        networkInterfaceStream: expect.any(Object),
        options: expect.any(Object),
        save: expect.any(Function),
        getOptionName: expect.any(Function),
        getLustreNetworkDriverTypeMessage: expect.any(Function),
        getLustreNetworkDiffMessage: expect.any(Function)
      });
    });

    it('should return the ln name based on a value', () => {
      expect(
        ctrl.getOptionName({
          nid: {
            lnd_network: 2
          }
        })
      ).toEqual('Lustre Network 2');
    });

    it('should return the driver type from help', () => {
      ctrl.getLustreNetworkDriverTypeMessage({
        local: 'tcp',
        status: 'local'
      });

      expect(insertHelpFilter).toHaveBeenCalledOnceWith('local_diff', {
        local: 'tcp',
        status: 'local'
      });
    });

    it('return the correct network name', () => {
      ctrl.getLustreNetworkDiffMessage({
        local: 1,
        remote: 2,
        initial: -1,
        status: 'remote'
      });

      expect(insertHelpFilter).toHaveBeenCalledOnceWith('remote_diff', {
        local: 'Lustre Network 1',
        remote: 'Lustre Network 2',
        initial: 'Not Lustre Network'
      });
    });

    describe('save', () => {
      beforeEach(() => {
        ctrl.networkInterfaces = [
          {
            nid: { id: '1' }
          },
          {
            nid: { id: '2' }
          }
        ];

        ctrl.save(true);
        ss.write({
          command: {
            id: 10
          }
        });
        ss.end();
      });

      it('should send the post', () => {
        expect(mockSocketStream).toHaveBeenCalledOnceWith(
          '/nid',
          {
            method: 'post',
            json: {
              objects: [{ id: '1' }, { id: '2' }]
            }
          },
          true
        );
      });

      it('should call waitForCommandCompletion with the last response', () => {
        expect(waitForCommandCompletion).toHaveBeenCalledOnceWith(true);
        expect(waitForCommandCompletionResponse).toHaveBeenCalledOnceWith([
          {
            id: 10
          }
        ]);
      });
    });

    describe('working with data', () => {
      beforeEach(() => {
        networkInterfaceStream.write(networkInterfaceResponse);
      });

      it('should set network interfaces on the controller', () => {
        expect(ctrl.networkInterfaces).toEqual(networkInterfaceResponse);
      });
    });
  });
});
