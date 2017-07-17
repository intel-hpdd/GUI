// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';
import socketStream from '../socket/socket-stream.js';

export function ConfigureLnetController(
  $scope: Object,
  LNET_OPTIONS: Object,
  insertHelpFilter: Function,
  waitForCommandCompletion: Function,
  propagateChange: Function
) {
  'ngInject';
  const ctrl = this;

  const getNetworkName = value =>
    LNET_OPTIONS.find(x => x.value === value).name;

  const lndNetworkLens = fp.view(
    fp.compose(fp.lensProp('nid'), fp.lensProp('lnd_network'))
  );

  Object.assign(ctrl, {
    options: LNET_OPTIONS,
    save(showModal) {
      ctrl.saving = true;

      socketStream(
        '/nid',
        {
          method: 'post',
          json: {
            objects: fp.pluck('nid')(ctrl.networkInterfaces)
          }
        },
        true
      )
        .map(x => [x.command])
        .flatMap(waitForCommandCompletion(showModal))
        .map(() => false)
        .through(propagateChange.bind(null, $scope, ctrl, 'saving'));
    },
    getLustreNetworkDriverTypeMessage(state) {
      return insertHelpFilter(`${state.status}_diff`, state);
    },
    getLustreNetworkDiffMessage(state) {
      return insertHelpFilter(`${state.status}_diff`, {
        local: getNetworkName(state.local),
        remote: getNetworkName(state.remote),
        initial: getNetworkName(state.initial)
      });
    },
    getOptionName(record) {
      return getNetworkName(lndNetworkLens(record));
    }
  });

  ctrl.networkInterfaceStream.through(
    propagateChange.bind(null, $scope, ctrl, 'networkInterfaces')
  );

  $scope.$on(
    '$destroy',
    ctrl.networkInterfaceStream.destroy.bind(ctrl.networkInterfaceStream)
  );
}

export const configureLnetComponent = {
  bindings: {
    networkInterfaceStream: '<',
    activeFsMember: '<'
  },
  controller: ConfigureLnetController,
  template: `<div class="configure-lnet detail-panel diff" config-toggle>
  <h4 class="section-header">NID Configuration</h4>

  <div ng-if="$ctrl.activeFsMember" class="alert alert-info">
    <i class="fa fa-info-circle"></i> To edit this NID configuration, first stop the file system that this server belongs to.
  </div>
  <div ng-if="$ctrl.saving" class="alert alert-info">
    Saving <i class="fa fa-spinner fa-spin"></i>
  </div>

  <diff-container>
    <div class="detail-row config-header">
      <div>Interface</div>
      <div>IP Address</div>
      <div>Lustre Network Driver</div>
      <div>Lustre Network</div>
    </div>
    <div class="detail-row" ng-repeat="networkInterface in $ctrl.networkInterfaces | orderBy:'name' track by networkInterface.id">
      <div>{{ networkInterface.name }}</div>
      <div>{{ networkInterface.inet4_address }}</div>

      <div ng-if="$ctrl.activeFsMember || configToggle.inactive()">{{ networkInterface.nid.lnd_type }}</div>
      <differ ng-if="!$ctrl.activeFsMember && configToggle.active()">
        <select
          class="form-control"
          ng-model="networkInterface.nid.lnd_type"
          ng-options="type for type in networkInterface.lnd_types"
          diff-model
        ></select>
        <reset-diff on-message="$ctrl.getLustreNetworkDriverTypeMessage(state)"></reset-diff>
      </differ>

      <div ng-if="$ctrl.activeFsMember || configToggle.inactive()">{{ $ctrl.getOptionName(networkInterface) }}</div>
      <differ ng-if="!$ctrl.activeFsMember && configToggle.active()">
        <select
          class="form-control"
          ng-model="networkInterface.nid.lnd_network"
          ng-options="option.value as option.name for option in $ctrl.options | removeUsedLnetOptions:$ctrl.networkInterfaces:networkInterface"
          diff-model
          ></select>
        <reset-diff on-message="$ctrl.getLustreNetworkDiffMessage(state)"></reset-diff>
      </differ>
    </div>

    <div class="configure-btns" ng-if="configToggle.inactive() && !$ctrl.activeFsMember">
      <button class="btn btn-primary btn-block btn-sm edit-btn" ng-click="::configToggle.setActive()">
        Configure<i class="fa fa-gear"></i>
      </button>
    </div>

    <div class="save-btns" ng-if="configToggle.active()">
      <div class="save-button btn-group block-dropdown" uib-dropdown>
        <button type="button" ng-click="::configToggle.setInactive(); $ctrl.save(true)" class="btn btn-success" ng-disabled="$ctrl.saving || diffContainer.noSubmit()">
          Save<i class="fa" ng-class="{'fa-spinner fa-spin': $ctrl.message, 'fa-check-circle-o': !$ctrl.message }"></i>
        </button>

        <button type="button" class="btn btn-success dropdown-toggle" uib-dropdown-toggle ng-disabled="$ctrl.saving || diffContainer.noSubmit()">
          <span class="caret"></span>
        </button>

        <ul class="dropdown-menu btn-block" uib-dropdown-menu role="menu">
          <li>
            <a ng-click="::configToggle.setInactive(); $ctrl.save(false)">Save and skip command view</a>
          </li>
        </ul>
      </div>

      <button class="btn btn-cancel btn-block" ng-click="::configToggle.setInactive(); diffContainer.reset()">
        Cancel<i class="fa fa-times-circle-o"></i>
      </button>
    </div>
  </diff-container>
</div>`
};
