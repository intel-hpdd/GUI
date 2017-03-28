// @flow

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

import socketStream from '../socket/socket-stream.js';

import type { $scopeT } from 'angular';

export default {
  bindings: {
    subscriptions: '<',
    resourceUri: '<'
  },
  controller(
    $scope: $scopeT,
    insertHelpFilter: Function,
    propagateChange: Function
  ) {
    'ngInject';
    const toVal = x => x === true ? 'On' : 'Off';

    this.getMessage = state => {
      return insertHelpFilter(`${state.status}_diff`, {
        local: toVal(state.local),
        remote: toVal(state.remote),
        initial: toVal(state.initial)
      });
    };

    this.saveAlerts = (resourceUri, alertTypes) => {
      this.saving = true;

      socketStream(
        '/api/alert_subscription/',
        {
          method: 'patch',
          json: {
            objects: alertTypes
              .filter(x => !x.sub_uri)
              .filter(x => x.selected === true)
              .map(x => ({
                user: resourceUri,
                alert_type: x.resource_uri
              })),
            deleted_objects: alertTypes
              .filter(x => x.sub_uri)
              .filter(x => x.selected === false)
              .map(x => x.sub_uri)
          }
        },
        true
      )
        .map(() => false)
        .through(propagateChange($scope, this, 'saving'));
    };
  },
  template: `
    <div class="detail-panel" config-toggle>
      <h4 class="section-header">Notifications</h4>
      <div ng-if="$ctrl.saving" class="alert alert-info">
        Saving <i class="fa fa-spinner fa-spin"></i>
      </div>
      <multi-toggler-container>
        <diff-container>
          <div class="detail-row" ng-repeat="alertType in $ctrl.subscriptions |  orderBy:'description' track by alertType.resource_uri">
            <div class="sub-label">{{::alertType.description}}:</div>
            <div>
              <differ ng-if="configToggle.active()">
                <button
                  class="btn btn-info btn-sm"
                  ng-model="alertType.selected"
                  uib-btn-checkbox
                  diff-model
                  multi-toggler-model
                >
                  <span ng-if="alertType.selected">
                    <i class="fa fa-fw fa-check" aria-hidden="true"></i> On
                  </span>
                  <span ng-if="!alertType.selected">
                    <i class="fa fa-fw fa-ban" aria-hidden="true"></i> Off
                  </span>
                </button>
                <reset-diff on-message="::$ctrl.getMessage(state)"></reset-diff>
              </differ>
              <span class="toggle-label" ng-if="configToggle.inactive()">
                <span ng-if="alertType.selected">
                  <i class="fa fa-fw fa-check" aria-hidden="true"></i> On
                </span>
                <span ng-if="!alertType.selected">
                  <i class="fa fa-fw fa-ban" aria-hidden="true"></i> Off
                </span>
              </span>
            </div>
          </div>
        </diff-container>
        <button
          ng-if="configToggle.inactive()"
          class="btn btn-primary btn-block btn-sm edit-btn"
          ng-click="::configToggle.setActive()"
        >
          Configure<i class="fa fa-gear"></i>
        </button>
        <div ng-if="configToggle.active()" class="toggle-controls">
          <multi-toggler></multi-toggler>
          <button
            class="btn btn-success btn btn-block save-btn"
            ng-disabled="diffContainer.noSubmit()"
            ng-click="::$ctrl.saveAlerts($ctrl.resourceUri, $ctrl.subscriptions); configToggle.setInactive()"
          > Save <i class="fa fa-check-circle-o"></i>
          </button>
          <button
            class="btn btn btn-block cancel-btn"
            ng-click="::configToggle.setInactive(); diffContainer.reset()"
          > Cancel <i class="fa fa-times-circle-o"></i>
          </button>
        </div>
      </multi-toggler-container>
    </div>
  `
};
