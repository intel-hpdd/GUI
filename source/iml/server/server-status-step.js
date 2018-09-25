//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";

import { resolveStream } from "../promise-transforms.js";

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
  "ngInject";
  Object.assign(this, {
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
      $scope.$emit("addServerModal::closeModal");
    }
  });

  const serverStatusStep = this;

  testHostStream
    .tap(function(resp) {
      serverStatusStep.isValid = resp.valid;
      serverStatusStep.serversStatus = hostlistFilter.setHosts(resp.objects).compute();
    })
    .stopOnError(fp.unary($exceptionHandler))
    .each(localApply.bind(null, $scope));
}

export const serverStatusStep = {
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
  controller: "ServerStatusStepCtrl as serverStatus",
  onEnter: [
    "data",
    "getTestHostStream",
    "serversToApiObjects",
    function onEnter(data, getTestHostStream, serversToApiObjects) {
      const objects = serversToApiObjects(data.servers);

      return {
        testHostStream: resolveStream(getTestHostStream(data.spring, { objects: objects })),
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
    return action === "previous" ? steps.addServersStep : steps.selectServerProfileStep;
  }
};
