describe('Configure LNet', function () {
  'use strict';

  beforeEach(module('lnetModule', 'dataFixtures'));

  describe('Controller', function () {
    var configureLnet, $scope, $exceptionHandler, networkInterfaceStream,
      socketStream, networkInterfaceResponse, waitForCommandCompletion, LNET_OPTIONS;

    beforeEach(inject(function ($rootScope, $controller, networkInterfaceDataFixtures, _LNET_OPTIONS_) {
      LNET_OPTIONS = _LNET_OPTIONS_;

      waitForCommandCompletion = jasmine
        .createSpy('waitForCommandCompletion')
        .andCallFake(function (show, response) {
          return highland([response]);
        });

      networkInterfaceResponse = angular.copy(networkInterfaceDataFixtures[0].in);

      $scope = $rootScope.$new();

      networkInterfaceStream = highland();
      spyOn(networkInterfaceStream, 'destroy');

      socketStream = jasmine.createSpy('socketStream')
        .andReturn(highland());

      spyOn($scope, '$on').andCallThrough();

      $scope.networkInterfaceStream = networkInterfaceStream;

      $exceptionHandler = jasmine.createSpy('$exceptionHandler');

      $controller('ConfigureLnetController', {
        $scope: $scope,
        $exceptionHandler: $exceptionHandler,
        socketStream: socketStream,
        waitForCommandCompletion: fp.curry(2, waitForCommandCompletion)
      });

      configureLnet = $scope.configureLnet;
    }));

    it('should listen for $destroy', function () {
      expect($scope.$on)
        .toHaveBeenCalledOnceWith('$destroy', jasmine.any(Function));
    });

    it('should end the network interface stream on destroy', function () {
      $scope.$on.mostRecentCall.args[1]();

      expect(networkInterfaceStream.destroy).toHaveBeenCalledOnce();
    });

    it('should setup the scope as expected', function () {
      expect($scope.configureLnet).toEqual({
        setEditable: jasmine.any(Function),
        networkInterfaces: [],
        options: LNET_OPTIONS,
        save: jasmine.any(Function),
        getOptionName: jasmine.any(Function),
        diff: jasmine.any(Function),
        isDirty: jasmine.any(Function),
        cleanLnd: jasmine.any(Function),
        cleanLn: jasmine.any(Function)
      });
    });

    describe('setEditable', function () {
      beforeEach(function () {
        networkInterfaceStream.write(networkInterfaceResponse);

        var nid = configureLnet.networkInterfaces[0].nid;
        nid.lnd_network = 2;
        nid.lnd_type = 'tcp';

        $scope.configureLnet.setEditable(false);
      });

      it('should set the editable flag', function () {
        expect($scope.configureLnet.editable).toBe(false);
      });

      it('should reset lnd to remote', function () {
        expect(configureLnet.networkInterfaces[0].nid.lnd_type).toEqual('o2ib');
      });

      it('should reset ln to remote', function () {
        expect(configureLnet.networkInterfaces[0].nid.lnd_network).toEqual(3);
      });
    });

    it('should return the ln name based on a value', function () {
      expect($scope.configureLnet.getOptionName({
        nid: {
          lnd_network: 2
        }
      }))
        .toEqual('Lustre Network 2');
    });

    it('should call the exception handler on error during save', function () {
      configureLnet.save();
      socketStream.plan().write({
        __HighlandStreamError__: true,
        error: new Error('boom!')
      });
      socketStream.plan().end();

      expect($exceptionHandler).toHaveBeenCalledOnceWith(new Error('boom!'));
    });

    describe('save', function () {
      beforeEach(function () {
        configureLnet.networkInterfaces = [
          {
            nid: { id: '1'}
          },
          {
            nid: { id: '2'}
          }
        ];

        configureLnet.save();
        socketStream.plan().write({
          command: {
            id: 10
          }
        });
        socketStream.plan().end();
      });

      it('should set the editable flag', function () {
        expect(configureLnet.editable).toBe(false);
      });

      it('should send the post', function () {
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

      it('should call waitForCommandCompletion with the last response', function () {
        expect(waitForCommandCompletion).toHaveBeenCalledOnceWith(true, {
          command: {
            id: 10
          }
        });
      });
    });

    describe('working with data', function () {
      beforeEach(function () {
        networkInterfaceStream.write(networkInterfaceResponse);
      });

      it('should set network interfaces on the scope', function () {
        expect(configureLnet.networkInterfaces).toEqual(networkInterfaceResponse);
      });

      it('should remove old items', function () {
        networkInterfaceStream.write([{
          id: '26',
          nid: {
            lnd_network: 3
          }
        }]);

        expect(configureLnet.networkInterfaces)
          .toEqual([{
            id: '26',
            nid: {
              lnd_network: 3,
              lnd_type: 'o2ib'
            }
          }]);
      });

      it('should add new items', function () {
        var response = [
          {
            id: '900',
            nid: {
              lnd_network: 1000
            }
          }
        ];

        networkInterfaceStream.write(response);

        expect(configureLnet.networkInterfaces).toContain(response[0]);
      });
    });

    it('should call the exception handler on error', function () {
      networkInterfaceStream.write({
        __HighlandStreamError__: true,
        error: new Error('boom!')
      });

      expect($exceptionHandler).toHaveBeenCalledOnceWith(new Error('boom!'));
    });

    describe('diffing lustre network', function () {
      beforeEach(function () {
        networkInterfaceStream.write(networkInterfaceResponse);
      });

      it('should return no diff if nothing changed', function () {
        expect(configureLnet.diff(configureLnet.networkInterfaces[0]))
          .toEqual({});
      });

      it('should tell if there was a local change', function () {
        configureLnet.networkInterfaces[0].nid.lnd_network = 2;

        expect(configureLnet.diff(configureLnet.networkInterfaces[0]))
          .toEqual({
            lndNetwork: {
              name: 'lndNetwork',
              lens: jasmine.any(Function),
              resetInitial: jasmine.any(Function),
              resetLocal: jasmine.any(Function),
              diff: {
                initial: 3,
                remote: 3
              },
              type: 'local'
            }
          });
      });

      it('should tell if there was a remote change', function () {
        var r = angular.copy(networkInterfaceResponse);
        var item = _.find(r, { id: '26' });
        item.nid.lnd_network = -1;

        networkInterfaceStream.write(r);

        var localItem = _.find(configureLnet.networkInterfaces, { id: '26' });

        expect(configureLnet.diff(localItem))
          .toEqual({
            lndNetwork: {
              name: 'lndNetwork',
              lens: jasmine.any(Function),
              resetInitial: jasmine.any(Function),
              resetLocal: jasmine.any(Function),
              diff: {
                initial: 3,
                remote: -1
              },
              type: 'remote'
            }
          });
      });

      it('should tell if there was a local and remote change', function () {
        var r = angular.copy(networkInterfaceResponse);
        var item = _.find(r, { id: '26' });
        item.nid.lnd_network = -1;

        networkInterfaceStream.write(r);

        var localItem = _.find(configureLnet.networkInterfaces, { id: '26' });
        localItem.nid.lnd_network = 2;

        expect(configureLnet.diff(localItem))
          .toEqual({
            lndNetwork: {
              name: 'lndNetwork',
              lens: jasmine.any(Function),
              resetInitial: jasmine.any(Function),
              resetLocal: jasmine.any(Function),
              diff: {
                initial: 3,
                remote: -1
              },
              type: 'conflict'
            }
          });
      });
    });

    describe('diffing lustre network driver', function () {
      beforeEach(function () {
        networkInterfaceStream.write(networkInterfaceResponse);
      });

      it('should return no diff if nothing changed', function () {
        expect(configureLnet.diff(configureLnet.networkInterfaces[0]))
          .toEqual({});
      });

      it('should tell if there was a local change', function () {
        configureLnet.networkInterfaces[0].nid.lnd_type = 'tcp';

        expect(configureLnet.diff(configureLnet.networkInterfaces[0]))
          .toEqual({
            lndType: {
              name: 'lndType',
              lens: jasmine.any(Function),
              resetInitial: jasmine.any(Function),
              resetLocal: jasmine.any(Function),
              diff: {
                initial: 'o2ib',
                remote: 'o2ib'
              },
              type: 'local'
            }
          });
      });

      it('should tell if there was a remote change', function () {
        var r = angular.copy(networkInterfaceResponse);
        var item = _.find(r, { id: '26' });
        item.nid.lnd_type = 'tcp';

        networkInterfaceStream.write(r);

        var localItem = _.find(configureLnet.networkInterfaces, { id: '26' });

        expect(configureLnet.diff(localItem))
          .toEqual({
            lndType: {
              name: 'lndType',
              lens: jasmine.any(Function),
              resetInitial: jasmine.any(Function),
              resetLocal: jasmine.any(Function),
              diff: {
                initial: 'o2ib',
                remote: 'tcp'
              },
              type: 'remote'
            }
          });
      });

      it('should not be able to report conflicts', function () {
        var r = angular.copy(networkInterfaceResponse);
        var item = _.find(r, { id: '26' });
        item.nid.lnd_type = 'tcp';

        networkInterfaceStream.write(r);

        var localItem = _.find(configureLnet.networkInterfaces, { id: '26' });
        localItem.nid.lnd_type = 'tcp';

        expect(configureLnet.diff(localItem))
          .toEqual({
            lndType: {
              name: 'lndType',
              lens: jasmine.any(Function),
              resetInitial: jasmine.any(Function),
              resetLocal: jasmine.any(Function),
              diff: {
                initial: 'o2ib',
                remote: 'tcp'
              },
              type: 'local'
            }
          });
      });

      describe('isDirty', function () {
        it('should return false when clean', function () {
          expect($scope.configureLnet.isDirty()).toBe(false);
        });

        it('should return true when dirty', function () {
          networkInterfaceStream.write(networkInterfaceResponse);

          var localItem = _.find(configureLnet.networkInterfaces, { id: '26' });
          localItem.nid.lnd_type = 'tcp';

          expect($scope.configureLnet.isDirty()).toBe(true);
        });
      });

      it('should clean lnd', function () {
        networkInterfaceStream.write(networkInterfaceResponse);

        var local = angular.copy(configureLnet.networkInterfaces[0]);
        local.nid.lnd_type = 'tcp';

        expect($scope.configureLnet.cleanLnd(local));

        expect(local.nid.lnd_type).toEqual('o2ib');
      });

      it('should clean ln', function () {
        networkInterfaceStream.write(networkInterfaceResponse);

        var local = angular.copy(configureLnet.networkInterfaces[0]);
        local.nid.lnd_network = '2';

        expect($scope.configureLnet.cleanLn(local));

        expect(local.nid.lnd_network).toEqual(3);
      });
    });
  });
});
