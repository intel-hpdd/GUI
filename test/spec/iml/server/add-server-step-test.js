import angular from '../../../angular-mock-setup.js';

describe('Add server step', () => {
  let AddServerStepCtrl, addServersStep;

  beforeEach(() => {
    const mod = require('../../../../source/iml/server/add-server-step.js');

    AddServerStepCtrl = mod.AddServerStepCtrl;
    addServersStep = mod.addServersStepFactory();
  });

  let $stepInstance, addServerStepCtrl;

  [
    {},
    {
      servers: {
        auth_type: 'existing_keys_choice',
        addresses: ['foo2.localdomain']
      }
    },
    {
      servers: {
        auth_type: 'existing_keys_choice',
        addresses: ['foo1.localdomain']
      }
    }
  ].forEach(data => {
    describe('controller', () => {
      let $scope;

      beforeEach(
        angular.mock.inject($rootScope => {
          $scope = $rootScope.$new();

          $stepInstance = {
            getState: jest.fn(),
            transition: jest.fn()
          };

          addServerStepCtrl = new AddServerStepCtrl($scope, $stepInstance, {
            ...data
          });
        })
      );

      it('should setup the controller', () => {
        const expected = {
          fields: {
            auth_type: getDataInstallMethod(data),
            pdsh: getPdshExpression(data)
          },
          CHOICES: Object.freeze({
            EXISTING_KEYS: 'existing_keys_choice',
            ROOT_PASSWORD: 'id_password_root',
            ANOTHER_KEY: 'private_key_choice'
          }),
          pdshUpdate: expect.any(Function),
          transition: expect.any(Function),
          close: expect.any(Function)
        };

        expect(addServerStepCtrl).toEqual(expected);
      });

      it('should update the fields on pdsh change', () => {
        addServerStepCtrl.pdshUpdate(
          'foo[01-02].com',
          ['foo01.com', 'foo02.com'],
          { 'foo01.com': 1, 'foo02.com': 1 }
        );

        expect(addServerStepCtrl.fields).toEqual({
          auth_type: 'existing_keys_choice',
          pdsh: 'foo[01-02].com',
          addresses: ['foo01.com', 'foo02.com']
        });
      });

      describe('calling transition', () => {
        beforeEach(() => {
          addServerStepCtrl.transition();
        });

        it('should set add server to disabled', () => {
          expect(addServerStepCtrl.disabled).toEqual(true);
        });

        it('should call transition on the step instance', () => {
          const expected = {
            data: {
              servers: {
                auth_type: getDataInstallMethod(data)
              },
              pdsh: getPdshExpression(data)
            }
          };

          expect($stepInstance.transition).toHaveBeenCalledOnceWith(
            'next',
            expected
          );
        });
      });
    });

    function getDataInstallMethod(data) {
      return data.servers ? data.servers.auth_type : 'existing_keys_choice';
    }

    function getPdshExpression(data) {
      return data.pdsh;
    }
  });

  describe('add servers step', () => {
    it('should create the step with the expected interface', () => {
      expect(addServersStep).toEqual({
        template: `<div class="modal-header tooltip-container">
  <button type="button" class="close" ng-disabled="addServer.disabled" ng-click="addServer.close()">
    <i class="fa fa-times"></i>
  </button>
  <h4 class="modal-title">Add Server - Add New Servers</h4>
  <span class="tooltip-container tooltip-hover">
    <i class="fa fa-question-circle">
      <iml-tooltip size="'large'" direction="bottom">
        <span>Use the Hostlist Expression input below to add multiple hosts.</span>
      </iml-tooltip>
    </i>
  </span>
</div>
<div class="modal-body add-server-step">
  <form name="addServerForm" novalidate>
    <div class="form-group pdsh-input" ng-class="{'has-error': addServerForm.pdsh.$invalid, 'has-success': addServerForm.pdsh.$valid}">
      <div>
        <label>Enter Hostname / Hostlist Expression</label>
        <span class="tooltip-container tooltip-hover">
          <i class="fa fa-question-circle">
            <iml-tooltip size="'large'" direction="right">
              <span>Enter a hostname / hostlist expression for servers that you would like to add.</span>
            </iml-tooltip>
          </i>
        </span>
      </div>
      <pdsh pdsh-initial="addServer.fields.pdsh" pdsh-change="addServer.pdshUpdate(pdsh, hostnames, hostnamesHash)"
            pdsh-required="true"></pdsh>
    </div>
    <div class="form-group">
      <div>
        <label>
          SSH Authentication
          <a class="item-help tooltip-container tooltip-hover">
            <i class="fa fa-question-circle"></i>
            <help-tooltip size="'large'" topic="ssh_authentication_tooltip" direction="top"></help-tooltip>
          </a>
        </label>
      </div>
      <div class="btn-group ssh-auth-choices">
        <label class="btn btn-primary tooltip-container tooltip-hover" ng-model="addServer.fields.auth_type" uib-btn-radio="addServer.CHOICES.EXISTING_KEYS">Existing Key<i class="fa fa-question-circle"></i>
          <help-tooltip size="'large'" topic="existing_keys_tooltip" direction="top"></help-tooltip>
        </label>

        <label class="btn btn-primary tooltip-container tooltip-hover" ng-model="addServer.fields.auth_type" uib-btn-radio="addServer.CHOICES.ROOT_PASSWORD">Root Password<i class="fa fa-question-circle"></i>
          <help-tooltip size="'large'" topic="root_password_tooltip" direction="top"></help-tooltip>
        </label>
        <label class="btn btn-primary tooltip-container tooltip-hover" ng-model="addServer.fields.auth_type" uib-btn-radio="addServer.CHOICES.ANOTHER_KEY">Another Key<i class="fa fa-question-circle"></i>
          <help-tooltip size="'large'" topic="another_key_tooltip" direction="top"></help-tooltip>
        </label>
      </div>
    </div>
    <div ng-if="addServer.fields.auth_type === addServer.CHOICES.ROOT_PASSWORD" class="root-password form-group choice" ng-class="{'has-error': addServerForm.root_password.$invalid}">
      <label>
        Root Password
        <a class="item-help tooltip-container tooltip-hover">
          <i class="fa fa-question-circle"></i>
          <help-tooltip size="'large'" direction="right" topic="root_password_input_tooltip"></help-tooltip>
        </a>
      </label>
      <input type="password" ng-model="addServer.fields.root_password" name="root_password" class="form-control" placeholder="Root Password" required />
      <iml-tooltip class="error-tooltip" toggle="addServerForm.root_password.$invalid" direction="bottom">
        Root Password is required.
      </iml-tooltip>
    </div>
    <div class="another-key choice" ng-if="addServer.fields.auth_type === addServer.CHOICES.ANOTHER_KEY">
      <div class="form-group" ng-class="{'has-error': addServerForm.private_key.$invalid}">
        <label>
          Private Key
          <a class="item-help tooltip-container tooltip-hover">
            <i class="fa fa-question-circle"></i>
            <help-tooltip size="'large'" direction="right" topic="private_key_textarea_tooltip"></help-tooltip>
          </a>
        </label>
        <textarea class="form-control" rows="3" ng-model="addServer.fields.private_key" name="private_key" required></textarea>
        <iml-tooltip class="error-tooltip" toggle="addServerForm.private_key.$invalid" direction="bottom">
          Private Key is required.
        </iml-tooltip>
      </div>
      <div class="form-group">
        <label class="private-key-label">
          Private Key Passphrase
          <a class="item-help tooltip-container tooltip-hover">
            <i class="fa fa-question-circle"></i>
            <help-tooltip size="'large'" direction="right" topic="private_key_input_tooltip"></help-tooltip>
          </a>
        </label>
        <input type="password" ng-model="addServer.fields.private_key_passphrase" name="private_key_passphrase" class="form-control" placeholder="Private Key Passphrase" />
      </div>
    </div>
  </form>
</div>
<div class="modal-footer">
  <button ng-if="!addServer.disabled" class="btn btn-success proceed" ng-disabled="addServerForm.$invalid" ng-click="addServer.transition()">Next <i class="fa fa-long-arrow-right"></i></button>
  <button ng-if="addServer.disabled" disabled class="btn btn-success proceed" ng-click="addServer.transition()">Verifying <i class="fa fa-spinner fa-spin"></i></button>
</div>`,
        controller: 'AddServerStepCtrl as addServer',
        transition: expect.any(Function)
      });
    });

    describe('transition', () => {
      let steps, result;

      beforeEach(() => {
        steps = {
          serverStatusStep: jest.fn()
        };

        result = addServersStep.transition(steps);
      });

      it('should return the next step and data', () => {
        expect(result).toEqual(steps.serverStatusStep);
      });
    });
  });
});
