//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@mfl/fp';

const viewLens = fp.flow(fp.lensProp, fp.view);

export function RecordStateCtrl($scope, $compile, STATE_SIZE, propagateChange) {
  'ngInject';
  const ctrl = Object.assign(this, {
    alerts: [],
    hasAlerts() {
      return ctrl.alerts.length > 0;
    },
    showLabel: function showLabel() {
      return ctrl.displayType === STATE_SIZE.MEDIUM;
    }
  });

  const viewer$ = ctrl.alertStream();
  const indexOfRecord = fp.invokeMethod('indexOf', [ctrl.recordId]);
  const recordFound = fp.flow(fp.eqFn(fp.identity)(indexOfRecord)(-1), fp.not);

  const p = propagateChange.bind(null, $scope, ctrl, 'alerts');

  viewer$
    .map(fp.filter(fp.flow(viewLens('affected'), recordFound)))
    .map(fp.map(viewLens('message')))
    .through(p);

  $scope.$on('$destroy', viewer$.destroy.bind(viewer$));
}

export const recordStateDirective = () => {
  'ngInject';
  return {
    scope: {},
    bindToController: {
      recordId: '=',
      displayType: '=',
      alertStream: '='
    },
    controller: RecordStateCtrl,
    controllerAs: 'ctrl',
    restrict: 'E',
    template: `<span class="record-state">
  <span class="icon-wrap tooltip-container tooltip-hover">
    <i class="fa activate-popover"
       ng-class="{'fa-exclamation-circle': ctrl.hasAlerts(), 'fa-check-circle': !ctrl.hasAlerts() }"
    >
      <iml-tooltip size="ctrl.alerts.length === 0 ? 'small' : 'medium'" direction="right">
        <ng-pluralize count="ctrl.alerts.length"
                      when="{
          0: 'No Issues',
          1: '{{ ctrl.alerts[0] }}',
          'other': '{} Issues'}">
        </ng-pluralize>
      </iml-tooltip>
    </i>
    <iml-popover placement="bottom" title="Alerts"
                 on-toggle="ctrl.onToggle(state)" ng-if="ctrl.hasAlerts()">
      <ul>
        <li ng-repeat="alert in ctrl.alerts">{{alert}}</li>
      </ul>
    </iml-popover>
  </span>
  <ng-pluralize class="state-label" ng-if="ctrl.showLabel()" count="ctrl.alerts.length"
                when="{
    0: 'No Issues',
    1: '{{ ctrl.alerts[0] }}',
    'other': '{} Issues'}">
  </ng-pluralize>
</span>`
  };
};
