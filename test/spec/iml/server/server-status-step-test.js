import angular from 'angular';
const {module, inject} = angular.mock;

describe('Server Status Step', function () {
  beforeEach(module('server'));

  describe('controller', function () {
    var $stepInstance, data, serverStatus, testHostStream, hostlistFilter;

    beforeEach(inject(function ($rootScope, $controller) {
      var $scope = $rootScope.$new();

      $stepInstance = {
        transition: jasmine.createSpy('transition')
      };

      testHostStream = highland();
      spyOn(testHostStream, 'destroy');

      data = {
        pdsh: 'storage0.localdomain'
      };

      hostlistFilter = {
        setHash: jasmine.createSpy('setHash').and.callFake(returnHostlistFilter),
        setHosts: jasmine.createSpy('setHosts').and.callFake(returnHostlistFilter),
        compute: jasmine.createSpy('compute')
      };

      function returnHostlistFilter () {
        return hostlistFilter;
      }

      serverStatus = $controller('ServerStatusStepCtrl', {
        $scope: $scope,
        $stepInstance: $stepInstance,
        data: data,
        testHostStream: testHostStream,
        hostlistFilter: hostlistFilter
      });
    }));

    it('should set the pdsh expression on the scope', function () {
      expect(serverStatus.pdsh).toEqual(data.pdsh);
    });

    it('should set hostnamesHash', function () {
      serverStatus.pdshUpdate('foo,bar', ['foo', 'bar'], {'foo': 1, 'bar': 1});

      expect(hostlistFilter.setHash).toHaveBeenCalledOnceWith({foo: 1, bar: 1});
    });

    describe('transitioning', function () {
      beforeEach(function () {
        serverStatus.transition('next');
      });

      it('should delegate to $stepInstance', function () {
        expect($stepInstance.transition).toHaveBeenCalledOnceWith('next', {
          data: data,
          showCommand: false
        });
      });

      it('should destroy the test host stream', function () {
        expect(testHostStream.destroy).toHaveBeenCalledOnce();
      });
    });

    describe('on data', function () {
      var response;

      beforeEach(function () {
        response = {
          valid: false,
          objects: [
            { address: 'test001.localdomain'},
            { address: 'test0011.localdomain'},
            { address: 'test003.localdomain' },
            { address: 'test0015.localdomain' },
            { address: 'test005.localdomain' }
          ]
        };

        testHostStream.write(response);
      });

      it('should set the hosts on the filter', function () {
        expect(hostlistFilter.setHosts).toHaveBeenCalledOnceWith(response.objects);
      });

      it('should set status validity', function () {
        expect(serverStatus.isValid).toBe(false);
      });
    });
  });

  describe('the step', function () {
    var serverStatusStep;

    beforeEach(inject(function (_serverStatusStep_) {
      serverStatusStep = _serverStatusStep_;
    }));

    it('should be created as expected', function () {
      expect(serverStatusStep).toEqual({
        templateUrl: 'iml/server/assets/html/server-status-step.html',
        controller: 'ServerStatusStepCtrl as serverStatus',
        onEnter: ['data', 'getTestHostStream', 'serversToApiObjects', 'resolveStream', jasmine.any(Function)],
        transition: jasmine.any(Function)
      });
    });

    describe('on enter', function () {
      var data, getTestHostStream, onEnter, serversToApiObjects, resolveStream;

      beforeEach(function () {
        getTestHostStream = jasmine.createSpy('getTestHostStream')
          .and.returnValue(highland());

        serversToApiObjects = jasmine.createSpy('serversToApiObjects')
          .and.returnValue([{
            address: 'lotus-34vm5.iml.intel.com',
            auth_type: 'existing_keys_choice'
          },
          {
            address: 'lotus-34vm6.iml.intel.com',
            auth_type: 'existing_keys_choice'
          }]);

        resolveStream = jasmine.createSpy('resolveStream')
          .and.returnValue(_.identity);

        data = {
          spring: jasmine.createSpy('spring'),
          servers: {
            addresses: [
              'lotus-34vm5.iml.intel.com',
              'lotus-34vm6.iml.intel.com'
            ]
          }
        };

        onEnter = _.last(serverStatusStep.onEnter);
        onEnter(data, getTestHostStream, serversToApiObjects, resolveStream);
      });

      it('should convert the servers to api objects', function () {
        expect(serversToApiObjects).toHaveBeenCalledOnceWith(data.servers);
      });

      it('should test the api objects', function () {
        expect(getTestHostStream).toHaveBeenCalledOnceWith(data.spring, {
          objects: [
            {
              address: 'lotus-34vm5.iml.intel.com',
              auth_type: 'existing_keys_choice'
            },
            {
              address: 'lotus-34vm6.iml.intel.com',
              auth_type: 'existing_keys_choice'
            }
          ]
        });
      });
    });

    describe('transition', function () {
      var steps;

      beforeEach(function () {
        steps = {
          addServersStep: {},
          selectServerProfileStep: {}
        };
      });

      it('should go to add servers step for a previous action', function () {
        var result = serverStatusStep.transition(steps, 'previous');

        expect(result).toEqual(steps.addServersStep);
      });

      it('should go to select profile step for proceed and skip', function () {
        var result = serverStatusStep.transition(steps, 'proceed and skip');

        expect(result).toEqual(steps.selectServerProfileStep);
      });

      it('should go to select profile step for proceed', function () {
        var result = serverStatusStep.transition(steps, 'proceed');

        expect(result).toEqual(steps.selectServerProfileStep);
      });
    });
  });
});
