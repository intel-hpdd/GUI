// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';

import { addCurrentPage } from '../api-transforms.js';

import type { $scopeT, $locationT } from 'angular';

import type { PropagateChange } from '../extend-scope-module.js';

export function StatusController($scope: $scopeT, $location: $locationT, propagateChange: PropagateChange) {
  'ngInject';
  const s = this.notification$
    .map(addCurrentPage)
    .tap(x => (this.meta = x.meta))
    .pluck('objects');

  propagateChange($scope, this, 'data', s);

  $scope.$on('$destroy', () => {
    this.notification$.destroy();
    this.tzPickerB.endBroadcast();
  });

  const types = ['CommandErroredAlert', 'CommandSuccessfulAlert', 'CommandRunningAlert', 'CommandCancelledAlert'];
  const getType = fp.flow(
    fp.view(fp.lensProp('record_type')),
    fp.lensProp,
    fp.view
  );
  this.isCommand = fp.flow(
    getType,
    fn => fn(fp.zipObject(types)(types))
  );

  this.pageChanged = () => {
    $location.search('offset', (this.meta.current_page - 1) * this.meta.limit);
  };
}

export default {
  bindings: {
    notification$: '<',
    tzPickerB: '<'
  },
  controller: StatusController,
  template: `
  <div ng-if="$ctrl.meta.total_count > 0">
    <table class="table">
      <thead>
        <tr>
          <th class="hidden-xs">Severity</th>
          <th class="hidden-xs">Type</th>
          <th>Begin</th>
          <th>End</th>
          <th>Message</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr ng-repeat="row in $ctrl.data track by row.resource_uri" ng-class="[row.severity, row.alert_type, {active: row.active}]">
          <td class="hidden-xs">
            <span>
              {{ ::row.severity }}
            </span>
          </td>
          <td class="hidden-xs">{{ row.record_type }}</td>
          <td as-viewer stream="::$ctrl.tzPickerB">
            <span as-value stream="::viewer">
              <a ng-if="curr.val.isUtc === true" route-to="log/?datetime__gte={{ row.begin | date : 'yyyy-MM-dd HH:mm:ssUTC' : 'UTC' }}">{{ row.begin | date : 'yyyy-MM-dd HH:mm:ss' : 'UTC' }}</a>
              <a ng-if="curr.val.isUtc === false" route-to="log/?datetime__gte={{ row.begin | date : 'yyyy-MM-dd HH:mm:ssUTC' : 'UTC' }}">{{ row.begin | date : 'yyyy-MM-dd HH:mm:ss' }}</a>
            </span>
          </td>
          <td as-viewer stream="::$ctrl.tzPickerB">
            <span as-value stream="::viewer">
              <a ng-if="!row.active && curr.val.isUtc === true" route-to="log/?datetime__lte={{ row.end | date : 'yyyy-MM-dd HH:mm:ssUTC' : 'UTC' }}">{{ row.end | date : 'yyyy-MM-dd HH:mm:ss' : 'UTC' }}</a>
              <a ng-if="!row.active && curr.val.isUtc === false" route-to="log/?datetime__lte={{ row.end | date : 'yyyy-MM-dd HH:mm:ssUTC' : 'UTC' }}">{{ row.end | date : 'yyyy-MM-dd HH:mm:ss' }}</a>
            </span>
          </td>
          <td>{{ row.message }}</td>
          <td>
            <deferred-action-dropdown restrict-to="{{ ::app.GROUPS.FS_ADMINS }}" ng-if="row.active && !$ctrl.isCommand(row)" row="::row"></deferred-action-dropdown>
            <deferred-cmd-modal-btn resource-uri="::row.alert_item" ng-if="::$ctrl.isCommand(row)"></deferred-cmd-modal-btn>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="text-center">
      <uib-pagination
        max-size="5"
        ng-model="$ctrl.meta.current_page"
        total-items="$ctrl.meta.total_count"
        items-per-page="$ctrl.meta.limit"
        boundary-links="true"
        previous-text="‹" next-text="›" first-text="«" last-text="»"
        ng-change="::$ctrl.pageChanged()"
      ></uib-pagination>
    </div>
  </div>
  <div class="well text-center no-records" ng-if="$ctrl.meta.total_count === 0">
    <h1>No records found</h1>
  </div>
  `
};
