import angular from 'angular';
import highland from 'highland';
import * as fp from 'intel-fp';
import lnetModule from '../../../../source/iml/lnet/lnet-module';

import networkInterfaceDataFixtures
  from '../../../data-fixtures/network-interface-fixtures.json!json';


import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('Configure LNet', () => {
  let $scope, ctrl, networkInterfaceStream, ss, insertHelpFilter,
    socketStream, networkInterfaceResponse, waitForCommandCompletion,
    mod, ConfigureLnetController;

  beforeEachAsync(async function () {
    socketStream = jasmine.createSpy('socketStream');

    mod = await mock('source/iml/lnet/configure-lnet.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });

    ConfigureLnetController = mod.ConfigureLnetController;
  });

  afterEach(resetAll);

  beforeEach(module(lnetModule));

  describe('Controller', () => {
    beforeEach(inject(($rootScope, $controller) => {
      waitForCommandCompletion = jasmine
        .createSpy('waitForCommandCompletion')
        .and.callFake((show, response) => {
          return highland([response]);
        });

      networkInterfaceResponse = angular.copy(networkInterfaceDataFixtures.in[0]);

      $scope = $rootScope.$new();

      networkInterfaceStream = highland();
      spyOn(networkInterfaceStream, 'destroy');

      ss = highland();
      socketStream
        .and.returnValue(ss);

      spyOn($scope, '$on').and.callThrough();

      insertHelpFilter = jasmine.createSpy('insertHelpFilter');

      ctrl = $controller(ConfigureLnetController,
        {
          $scope,
          socketStream,
          insertHelpFilter,
          networkInterfaceStream: jasmine.any(Object),
          waitForCommandCompletion: fp.curry2(waitForCommandCompletion)
        },
        {
          networkInterfaceStream
        }
      );

      jasmine.clock().install();
    }));

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should listen for $destroy', () => {
      expect($scope.$on)
        .toHaveBeenCalledOnceWith('$destroy', jasmine.any(Function));
    });

    it('should end the network interface stream on destroy', () => {
      $scope.$on.calls.mostRecent().args[1]();

      expect(networkInterfaceStream.destroy).toHaveBeenCalledOnce();
    });

    it('should setup the controller as expected', () => {
      expect(ctrl).toEqual(window.extendWithConstructor(
        ConfigureLnetController, {
          networkInterfaceStream: jasmine.any(Object),
          options: jasmine.any(Object),
          save: jasmine.any(Function),
          getOptionName: jasmine.any(Function),
          getLustreNetworkDriverTypeMessage: jasmine.any(Function),
          getLustreNetworkDiffMessage: jasmine.any(Function)
        }
      ));
    });

    it('should return the ln name based on a value', () => {
      expect(ctrl.getOptionName({
        nid: {
          lnd_network: 2
        }
      }))
        .toEqual('Lustre Network 2');
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
        expect(socketStream).toHaveBeenCalledOnceWith('/nid', {
          method: 'post',
          json: {
            objects: [
              { id: '1' },
              { id: '2' }
            ]
          }
        }, true);
      });

      it('should call waitForCommandCompletion with the last response', () => {
        expect(waitForCommandCompletion).toHaveBeenCalledOnceWith(true, [{
          id: 10
        }]);
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
