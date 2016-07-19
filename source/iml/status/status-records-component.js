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

// @flow

import * as fp from 'intel-fp';

import {
  addCurrentPage
} from '../api-transforms.js';

export function StatusController ($scope, $location, propagateChange) {
  'ngInject';

  const s = this.notification$
    .map(addCurrentPage)
    .tap(x => this.meta = x.meta)
    .pluck('objects');

  propagateChange($scope, this, 'data', s);

  $scope.$on('$destroy', () => this.notification$.destroy());

  var types = [
    'CommandErroredAlert',
    'CommandSuccessfulAlert',
    'CommandRunningAlert',
    'CommandCancelledAlert'
  ];
  var getType = fp.flow(
    fp.view(fp.lensProp('record_type')),
    fp.lensProp,
    fp.view
  );
  this.isCommand = fp.flow(getType, fp.invoke(fp.__, [fp.zipObject(types, types)]));

  this.pageChanged = () => {
    $location.search('offset', (this.meta.current_page - 1) * this.meta.limit);
  };
}


export default {
  bindings: {
    notification$: '<'
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
          <td>
            <a route-to="log/?datetime__gte={{ row.begin | date:'yyyy-MM-dd HH:mm:ss' : 'UTC' }}">{{ row.begin | date:'yyyy-MM-dd HH:mm:ss' : 'UTC' }}</a>
          </td>
          <td>
            <a ng-if="!row.active" route-to="log/?datetime__gte={{ row.end | date:'yyyy-MM-dd HH:mm:ss' }}">{{ row.end | date:'yyyy-MM-dd HH:mm:ss' : 'UTC' }}</a>
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
