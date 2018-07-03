// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

function controller($location: Object) {
  'ngInject';
  this.$onDestroy = () => {
    this.log$.destroy();
    this.tzPickerB.endBroadcast();
  };

  this.pageChanged = meta => {
    $location.search('offset', (meta.current_page - 1) * meta.limit);
  };
}

export default {
  bindings: {
    log$: '<',
    tzPickerB: '<'
  },
  controller,
  template: `
<div as-value stream="::$ctrl.log$">
  <div ng-if="curr.val.meta.total_count > 0">
    <table class="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Host</th>
          <th>Service</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        <tr ng-repeat="row in curr.val.objects track by row.resource_uri">
          <td>
            <display-date tz-picker-b="::$ctrl.tzPickerB" datetime="::row.datetime"></display-date>
          </td>
          <td restrict-to="{{ app.GROUPS.FS_ADMINS }}">
            <a ng-if="row.host_id != null" route-to="configure/server/{{ row.host_id }}">{{ ::row.fqdn }}</a>
            <span ng-if="row.host_id == null">{{ ::row.fqdn }}</span>
          </td>
          <td restrict="{{ app.GROUPS.FS_ADMINS }}">{{ ::row.fqdn }}</td>
          <td>
            {{ ::row.tag }}
          </td>
          <td>
            <message-substitution message="::row.message" substitutions="::row.substitutions">
            </message-substitution>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="text-center">
      <uib-pagination
        max-size="5"
        ng-model="curr.val.meta.current_page"
        total-items="curr.val.meta.total_count"
        items-per-page="curr.val.meta.limit"
        boundary-links="true"
        previous-text="‹" next-text="›" first-text="«" last-text="»"
        ng-change="::$ctrl.pageChanged(curr.val.meta)"
      ></uib-pagination>
    </div>
  </div>
  <div class="well text-center no-records" ng-if="curr.val.meta.total_count === 0">
    <h1>No records found</h1>
  </div>
</div>
  `
};
