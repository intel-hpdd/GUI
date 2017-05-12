import serverModule from '../../../../source/iml/server/server-module';
import highland from 'highland';
import * as fp from '@mfl/fp';

import { mock, resetAll } from '../../../system-mock.js';

describe('Server Status Step', () => {
  let mod, resolveStream;
  beforeEachAsync(async function() {
    resolveStream = jasmine.createSpy('resolveStream');

    mod = await mock('source/iml/server/server-status-step.js', {
      'source/iml/resolve-stream.js': {
        default: resolveStream
      },
      'source/iml/server/assets/html/server-status-step.html': {
        default: 'serverStatusStepTemplate'
      }
    });
  });

  afterEach(resetAll);

  beforeEach(module(serverModule));

  describe('controller', () => {
    let $stepInstance, data, serverStatus, testHostStream, hostlistFilter;

    beforeEach(
      inject(($rootScope, $controller) => {
        const $scope = $rootScope.$new();

        $stepInstance = {
          transition: jasmine.createSpy('transition')
        };

        testHostStream = highland();
        spyOn(testHostStream, 'destroy');

        data = {
          pdsh: 'storage0.localdomain'
        };

        hostlistFilter = {
          setHash: jasmine
            .createSpy('setHash')
            .and.callFake(returnHostlistFilter),
          setHosts: jasmine
            .createSpy('setHosts')
            .and.callFake(returnHostlistFilter),
          compute: jasmine.createSpy('compute')
        };

        function returnHostlistFilter() {
          return hostlistFilter;
        }

        serverStatus = $controller(mod.ServerStatusStepCtrl, {
          $scope,
          $stepInstance,
          data,
          testHostStream,
          hostlistFilter
        });
      })
    );

    it('should set the pdsh expression on the scope', () => {
      expect(serverStatus.pdsh).toEqual(data.pdsh);
    });

    it('should set hostnamesHash', () => {
      serverStatus.pdshUpdate('foo,bar', ['foo', 'bar'], { foo: 1, bar: 1 });

      expect(hostlistFilter.setHash).toHaveBeenCalledOnceWith({
        foo: 1,
        bar: 1
      });
    });

    describe('transitioning', () => {
      beforeEach(() => {
        serverStatus.transition('next');
      });

      it('should delegate to $stepInstance', () => {
        expect($stepInstance.transition).toHaveBeenCalledOnceWith('next', {
          data: data,
          showCommand: false
        });
      });

      it('should destroy the test host stream', () => {
        expect(testHostStream.destroy).toHaveBeenCalledTimes(1);
      });
    });

    describe('on data', () => {
      let response;

      beforeEach(() => {
        response = {
          valid: false,
          objects: [
            { address: 'test001.localdomain' },
            { address: 'test0011.localdomain' },
            { address: 'test003.localdomain' },
            { address: 'test0015.localdomain' },
            { address: 'test005.localdomain' }
          ]
        };

        testHostStream.write(response);
      });

      it('should set the hosts on the filter', () => {
        expect(hostlistFilter.setHosts).toHaveBeenCalledOnceWith(
          response.objects
        );
      });

      it('should set status validity', () => {
        expect(serverStatus.isValid).toBe(false);
      });
    });
  });

  describe('the step', () => {
    let serverStatusStep;
    beforeEach(() => {
      serverStatusStep = mod.serverStatusStep;
    });

    it('should be created as expected', () => {
      expect(serverStatusStep).toEqual({
        template: 'serverStatusStepTemplate',
        controller: 'ServerStatusStepCtrl as serverStatus',
        onEnter: [
          'data',
          'getTestHostStream',
          'serversToApiObjects',
          jasmine.any(Function)
        ],
        transition: jasmine.any(Function)
      });
    });

    describe('on enter', () => {
      let data, getTestHostStream, onEnter, serversToApiObjects;

      beforeEach(() => {
        getTestHostStream = jasmine
          .createSpy('getTestHostStream')
          .and.returnValue(highland());

        serversToApiObjects = jasmine
          .createSpy('serversToApiObjects')
          .and.returnValue([
            {
              address: 'lotus-34vm5.iml.intel.com',
              auth_type: 'existing_keys_choice'
            },
            {
              address: 'lotus-34vm6.iml.intel.com',
              auth_type: 'existing_keys_choice'
            }
          ]);
        resolveStream.and.returnValue(fp.identity);

        data = {
          spring: jasmine.createSpy('spring'),
          servers: {
            addresses: [
              'lotus-34vm5.iml.intel.com',
              'lotus-34vm6.iml.intel.com'
            ]
          }
        };

        onEnter = fp.last(serverStatusStep.onEnter);
        onEnter(data, getTestHostStream, serversToApiObjects, resolveStream);
      });

      it('should convert the servers to api objects', () => {
        expect(serversToApiObjects).toHaveBeenCalledOnceWith(data.servers);
      });

      it('should test the api objects', () => {
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

    describe('transition', () => {
      let steps;

      beforeEach(() => {
        steps = {
          addServersStep: {},
          selectServerProfileStep: {}
        };
      });

      it('should go to add servers step for a previous action', () => {
        const result = serverStatusStep.transition(steps, 'previous');

        expect(result).toEqual(steps.addServersStep);
      });

      it('should go to select profile step for proceed and skip', () => {
        const result = serverStatusStep.transition(steps, 'proceed and skip');

        expect(result).toEqual(steps.selectServerProfileStep);
      });

      it('should go to select profile step for proceed', () => {
        const result = serverStatusStep.transition(steps, 'proceed');

        expect(result).toEqual(steps.selectServerProfileStep);
      });
    });
  });
});
