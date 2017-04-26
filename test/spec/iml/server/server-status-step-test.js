import highland from 'highland';
import angular from '../../../angular-mock-setup.js';
describe('Server Status Step', () => {
  let mod, mockResolveStream;
  beforeEach(() => {
    mockResolveStream = jest.fn(x => x);
    jest.mock('../../../../source/iml/promise-transforms.js', () => ({
      resolveStream: mockResolveStream
    }));

    mod = require('../../../../source/iml/server/server-status-step.js');
  });

  describe('controller', () => {
    let $stepInstance,
      data,
      serverStatus,
      testHostStream,
      hostlistFilter,
      OVERRIDE_BUTTON_TYPES;
    beforeEach(
      angular.mock.inject(($rootScope, $exceptionHandler, localApply) => {
        const $scope = $rootScope.$new();
        $stepInstance = { transition: jest.fn() };
        testHostStream = highland();
        jest.spyOn(testHostStream, 'destroy');
        data = { pdsh: 'storage0.localdomain' };
        hostlistFilter = {
          setHash: jest.fn().mockImplementation(returnHostlistFilter),
          setHosts: jest.fn().mockImplementation(returnHostlistFilter),
          compute: jest.fn()
        };
        function returnHostlistFilter() {
          return hostlistFilter;
        }

        OVERRIDE_BUTTON_TYPES = {
          OVERRIDE: 'override',
          PROCEED: 'proceed',
          PROCEED_SKIP: 'proceed and skip'
        };

        serverStatus = {};

        mod.ServerStatusStepCtrl.bind(serverStatus)(
          $scope,
          $stepInstance,
          $exceptionHandler,
          OVERRIDE_BUTTON_TYPES,
          data,
          testHostStream,
          hostlistFilter,
          localApply
        );
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
        template: `<div class="modal-header">
  <button type="button" class="close" ng-click="serverStatus.close()" ng-disabled="serverStatus.disabled">
    <i class="fa fa-times"></i>
  </button>
  <h4 class="modal-title">Add Server - Check Server Status</h4>
  <span class="tooltip-container tooltip-hover">
    <i class="fa fa-question-circle"></i>
    <iml-tooltip size="'large'" direction="bottom">
      <span>Verify the status of the servers below. Green squares represent servers that have passed all checks. Red squares represent servers with one or more failed checks.</span>
    </iml-tooltip>
  </span>
</div>
<div class="modal-body server-status-step clearfix">
  <div ng-if="serverStatus.overridden" class="alert alert-danger" role="alert">
    You are about to add one or more servers with failed validations.
    Adding servers with failed validations is unsupported.
    Click <strong>proceed</strong> to continue.
  </div>
  <form name="filterServerForm" novalidate>
    <div class="form-group pdsh-input" ng-class="{'has-error': filterServerForm.pdsh.$invalid, 'has-success': filterServerForm.pdsh.$valid}">
      <div>
        <label>Filter by Hostname / Hostlist Expression</label>
        <span class="tooltip-container tooltip-hover">
          <i class="fa fa-question-circle"></i>
          <iml-tooltip size="'large'" direction="right">
            <span>Enter a hostname / hostlist expression to filter servers.</span>
          </iml-tooltip>
        </span>
      </div>
      <pdsh pdsh-initial="serverStatus.pdsh" pdsh-change="serverStatus.pdshUpdate(pdsh, hostnames, hostnamesHash)"></pdsh>
    </div>
  </form>
  <div class="status-cell-container" ng-repeat="server in serverStatus.serversStatus track by server.address">
    <div ng-class="{invalid: !server.valid, valid: server.valid}"
      class="status-cell activate-popover tooltip-container tooltip-hover">
      <span></span>
      <iml-tooltip size="'large'" direction="right">
        <span>Address: {{ server.address }}</span>
      </iml-tooltip>
    </div>
    <iml-popover title="Status for {{ server.address }}" placement="bottom">
      <ul class="well">
        <li ng-repeat="check in server.status track by check.name">
          <a class="tooltip-container tooltip-hover">
            <i ng-class="{ 'fa-times-circle': check.value == false, 'fa-check-circle': check.value }" class="fa"></i> {{ check.uiName }}
            <iml-tooltip size="'large'" direction="left">
              <span>{{ check.name | insertHelp }}</span>
            </iml-tooltip>
          </a>
        </li>
      </ul>
    </iml-popover>
  </div>
</div>
<div class="modal-footer">
  <button ng-disabled="serverStatus.disabled" class="btn btn-default" ng-click="serverStatus.transition('previous')"><i class="fa fa-long-arrow-left"></i> Previous</button>
  <override-button overridden="serverStatus.overridden" is-valid="serverStatus.isValid" on-change="serverStatus.transition(message)" is-disabled="serverStatus.disabled"></override-button>
</div>`,
        controller: 'ServerStatusStepCtrl as serverStatus',
        onEnter: [
          'data',
          'getTestHostStream',
          'serversToApiObjects',
          expect.any(Function)
        ],
        transition: expect.any(Function)
      });
    });
    describe('on enter', () => {
      let data, getTestHostStream, onEnter, serversToApiObjects;
      beforeEach(() => {
        getTestHostStream = jest.fn().mockReturnValue(highland());
        serversToApiObjects = jest.fn().mockReturnValue([
          {
            address: 'lotus-34vm5.iml.intel.com',
            auth_type: 'existing_keys_choice'
          },
          {
            address: 'lotus-34vm6.iml.intel.com',
            auth_type: 'existing_keys_choice'
          }
        ]);

        data = {
          spring: jest.fn(),
          servers: {
            addresses: [
              'lotus-34vm5.iml.intel.com',
              'lotus-34vm6.iml.intel.com'
            ]
          }
        };
        onEnter = serverStatusStep.onEnter[3];

        onEnter(data, getTestHostStream, serversToApiObjects);
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
        steps = { addServersStep: {}, selectServerProfileStep: {} };
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
