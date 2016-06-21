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


function controller ($location:Object) {
  'ngInject';

  this.pageChanged = meta => {
    $location.search('offset', (meta.current_page - 1) * meta.limit);
  };
}

export default {
  bindings: {
    log$: '<'
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
            <span>
              {{ ::row.datetime| date:'yyyy-MM-dd HH:mm:ss' : 'UTC' }}
            </span>
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
            {{ ::row.message }}
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
