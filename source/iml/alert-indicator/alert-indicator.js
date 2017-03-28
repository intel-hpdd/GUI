//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import * as fp from 'intel-fp';

const viewLens = fp.flow(fp.lensProp, fp.view);
import alertIndicatorTemplate from './assets/html/alert-indicator.html!text';

export function RecordStateCtrl($scope, $compile, STATE_SIZE, propagateChange) {
  'ngInject';
  const ctrl = angular.extend(this, {
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
  const recordFound = fp.flow(fp.eqFn(fp.identity, indexOfRecord, -1), fp.not);

  const p = propagateChange($scope, ctrl, 'alerts');

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
    controller: 'RecordStateCtrl',
    controllerAs: 'ctrl',
    restrict: 'E',
    template: alertIndicatorTemplate
  };
};
