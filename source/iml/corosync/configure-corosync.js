//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from '../socket/socket-stream.js';

import { pick } from '@iml/obj';

export function ConfigureCorosyncController($scope, waitForCommandCompletion, propagateChange, insertHelpFilter) {
  'ngInject';
  const ctrl = this;

  const p = propagateChange.bind(null, $scope, ctrl);

  Object.assign(ctrl, {
    observer: ctrl.stream(),
    getDiffMessage(state) {
      return insertHelpFilter(`${state.status}_diff`, state);
    },
    save(showModal) {
      ctrl.saving = true;

      socketStream(
        `/corosync_configuration/${ctrl.config.id}`,
        {
          method: 'put',
          json: pick(['id', 'mcast_port', 'network_interfaces'], ctrl.config)
        },
        true
      )
        .map(command => [command])
        .flatMap(waitForCommandCompletion(showModal))
        .map(() => false)
        .through(p.bind(null, 'saving'));
    }
  });

  ctrl.stream().through(p.bind(null, 'config'));

  $scope.$on('$destroy', () => {
    ctrl.stream.endBroadcast();
    ctrl.alertStream.endBroadcast();
    ctrl.jobStream.endBroadcast();
  });
}

export const configureCorosyncComponent = {
  template: `<div class="configure-corosync detail-panel" ng-class="{ saving: $ctrl.saving }" ng-form="form" ng-if="$ctrl.config" config-toggle>
  <h4 class="section-header">Corosync Configuration</h4>

  <div ng-if="$ctrl.saving" class="alert alert-info">
    Saving <i class="fa fa-spinner fa-spin"></i>
  </div>

  <diff-container>
    <div class="detail-row">
      <div>Mcast Port:</div>
      <div ng-if="configToggle.inactive()">{{ $ctrl.config.mcast_port }}</div>
      <differ ng-if="configToggle.active()">
        <input name="mcastPort" type="number" min="1" max="65536" required ng-model="$ctrl.config.mcast_port" diff-model class="form-control" />
        <iml-tooltip class="error-tooltip" toggle="form.mcastPort.$invalid" direction="bottom">
          <span ng-if="form.mcastPort.$error.max">Mcast Port must be less than or equal to 65536.</span>
          <span ng-if="form.mcastPort.$error.min">Mcast Port must be greater than or equal to 1.</span>
          <span ng-if="form.mcastPort.$error.number">Mcast Port must be a number.</span>
          <span ng-if="form.mcastPort.$error.required">Mcast Port is required.</span>
        </iml-tooltip>
        <reset-diff on-message="$ctrl.getDiffMessage(state)"></reset-diff>
      </differ>
    </div>

    <div class="detail-row">
      <div>State:</div>
      <div>
        <corosync-state stream="$ctrl.observer"></corosync-state>
      </div>
    </div>

    <div class="detail-row">
      <div>Alerts:</div>
      <div>
        <record-state record-id="$ctrl.config.resource_uri" alert-stream="$ctrl.alertStream" display-type="'medium'"></record-state>
        <job-status record-id="$ctrl.config.resource_uri" job-stream="$ctrl.jobStream"></job-status>
      </div>
    </div>

    <div class="configure-btns" ng-if="configToggle.inactive()" as-stream val="$ctrl.config">
      <action-dropdown tooltip-placement="top" stream="::str"></action-dropdown>

      <button class="btn btn-primary btn-block btn-sm edit-btn" ng-click="::configToggle.setActive()">
        Configure<i class="fa fa-gear"></i>
      </button>
    </div>

    <div ng-if="configToggle.active()" class="save-btns">
      <div class="save-button btn-group block-dropdown" uib-dropdown>
        <button
          type="button"
          class="btn btn-success"
          ng-click="::configToggle.setInactive(); $ctrl.save(true); diffContainer.reset()"
          ng-disabled="$ctrl.saving || form.mcastPort.$invalid || diffContainer.noSubmit()"
        >
          Save<i class="fa" ng-class="{'fa-spinner fa-spin': $ctrl.saving, 'fa-check-circle-o': !$ctrl.saving }"></i>
        </button>

        <button class="btn btn-success dropdown-toggle" uib-dropdown-toggle ng-disabled="$ctrl.saving || form.mcastPort.$invalid || diffContainer.noSubmit()">
          <span class="caret"></span>
        </button>

        <ul class="dropdown-menu btn-block" role="menu" uib-dropdown-menu>
          <li>
            <a ng-click="::configToggle.setInactive(); $ctrl.save(false); diffContainer.reset()">Save and skip command view</a>
          </li>
        </ul>
      </div>

      <button class="btn btn-cancel btn-block" ng-click="::configToggle.setInactive(); diffContainer.reset()">
        Cancel<i class="fa fa-times-circle-o"></i>
      </button>
    </div>
  </diff-container>
</div>`,
  bindings: {
    stream: '<',
    alertStream: '<',
    jobStream: '<'
  },
  restrict: 'E',
  controller: 'ConfigureCorosyncController'
};
