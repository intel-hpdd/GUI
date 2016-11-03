//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';

import addServerStepTemplate from './assets/html/add-server-step.html!text';

export const ADD_SERVER_AUTH_CHOICES = Object.freeze({
  EXISTING_KEYS: 'existing_keys_choice',
  ROOT_PASSWORD: 'id_password_root',
  ANOTHER_KEY: 'private_key_choice'
});

export function AddServerStepCtrl ($scope, $stepInstance, data) {
  'ngInject';

  var servers = data.servers;

  angular.extend(this, {
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
    pdshUpdate: function pdshUpdate (pdsh, hostnames) {
      this.fields.pdsh = pdsh;

      if (hostnames != null)
        this.fields.addresses = hostnames;
    },
    /**
     * Call the transition.
     */
    transition: function transition () {
      this.disabled = true;

      data.pdsh = this.fields.pdsh;
      delete this.fields.pdsh;

      data.servers = this.fields;

      $stepInstance.transition('next', { data: data });
    },
    /**
     * Close the modal
     */
    close: function close () {
      $scope.$emit('addServerModal::closeModal');
    }
  });
}

export function addServersStepFactory () {
  'ngInject';

  return {
    template: addServerStepTemplate,
    controller: 'AddServerStepCtrl as addServer',
    transition: function transition (steps) {
      return steps.serverStatusStep;
    }
  };
}
