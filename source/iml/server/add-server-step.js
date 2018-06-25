//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const ADD_SERVER_AUTH_CHOICES = Object.freeze({
  EXISTING_KEYS: 'existing_keys_choice',
  ROOT_PASSWORD: 'id_password_root',
  ANOTHER_KEY: 'private_key_choice'
});

export function AddServerStepCtrl($scope, $stepInstance, data) {
  'ngInject';
  const servers = data.servers;

  Object.assign(this, {
    fields: {
      auth_type: (servers && servers.auth_type) || ADD_SERVER_AUTH_CHOICES.EXISTING_KEYS,
      pdsh: data.pdsh
    },
    CHOICES: ADD_SERVER_AUTH_CHOICES,
    /**
     * Called on pdsh view change.
     * @param {String} pdsh
     * @param {Array} hostnames
     */
    pdshUpdate: function pdshUpdate(pdsh, hostnames) {
      this.fields.pdsh = pdsh;

      if (hostnames != null) this.fields.addresses = hostnames;
    },
    /**
     * Call the transition.
     */
    transition: function transition() {
      this.disabled = true;

      data.pdsh = this.fields.pdsh;
      delete this.fields.pdsh;

      data.servers = this.fields;

      $stepInstance.transition('next', { data: data });
    },
    /**
     * Close the modal
     */
    close: function close() {
      $scope.$emit('addServerModal::closeModal');
    }
  });
}

export function addServersStepFactory() {
  'ngInject';
  return {
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
    transition: function transition(steps) {
      return steps.serverStatusStep;
    }
  };
}
