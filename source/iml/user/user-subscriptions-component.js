// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from '../socket/socket-stream.js';

import type {
  $scopeT
} from 'angular';

export default {
  bindings: {
    subscriptions: '<',
    resourceUri: '<'
  },
  controller ($scope:$scopeT, insertHelpFilter:Function, propagateChange:Function) {
    'ngInject';

    const toVal = (x) => x === true ? 'On': 'Off';

    this.getMessage = (state) => {
      return insertHelpFilter(`${state.status}_diff`, {
        local: toVal(state.local),
        remote: toVal(state.remote),
        initial: toVal(state.initial)
      });
    };

    this.saveAlerts = (resourceUri, alertTypes) => {
      this.saving = true;

      socketStream('/api/alert_subscription/', {
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
      }, true)
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
