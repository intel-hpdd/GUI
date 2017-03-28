//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import * as fp from 'intel-fp';
import serverStatusStepTemplate
  from './assets/html/server-status-step.html!text';

import { resolveStream } from '../promise-transforms.js';

export function ServerStatusStepCtrl(
  $scope,
  $stepInstance,
  $exceptionHandler,
  OVERRIDE_BUTTON_TYPES,
  data,
  testHostStream,
  hostlistFilter,
  localApply
) {
  'ngInject';
  angular.extend(this, {
    pdsh: data.pdsh,
    /**
     * Update hostnames.
     * @param {String} pdsh
     * @param {Array} hostnames
     * @param {Object} hostnamesHash
     */
    pdshUpdate: function pdshUpdate(pdsh, hostnames, hostnamesHash) {
      this.serversStatus = hostlistFilter.setHash(hostnamesHash).compute();
    },
    /**
     * tells manager to perform a transition.
     * @param {String} action
     */
    transition: function transition(action) {
      if (action === OVERRIDE_BUTTON_TYPES.OVERRIDE) return;

      testHostStream.destroy();

      $stepInstance.transition(action, {
        data: data,
        showCommand: action === OVERRIDE_BUTTON_TYPES.PROCEED
      });
    },
    /**
     * Close the modal
     */
    close: function close() {
      $scope.$emit('addServerModal::closeModal');
    }
  });

  const serverStatusStep = this;

  testHostStream
    .tap(function(resp) {
      serverStatusStep.isValid = resp.valid;
      serverStatusStep.serversStatus = hostlistFilter
        .setHosts(resp.objects)
        .compute();
    })
    .stopOnError(fp.unary($exceptionHandler))
    .each(localApply.bind(null, $scope));
}

export const serverStatusStep = {
  template: serverStatusStepTemplate,
  controller: 'ServerStatusStepCtrl as serverStatus',
  onEnter: [
    'data',
    'getTestHostStream',
    'serversToApiObjects',
    function onEnter(data, getTestHostStream, serversToApiObjects) {
      const objects = serversToApiObjects(data.servers);

      return {
        testHostStream: resolveStream(
          getTestHostStream(data.spring, { objects: objects })
        ),
        data: data
      };
    }
  ],
  /**
   * Move to another step in the flow
   * @param {Object} steps
   * @param {String} action
   * @returns {Object} The step to move to.
   */
  transition: function transition(steps, action) {
    return action === 'previous'
      ? steps.addServersStep
      : steps.selectServerProfileStep;
  }
};
