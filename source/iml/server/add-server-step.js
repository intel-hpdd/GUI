//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

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
