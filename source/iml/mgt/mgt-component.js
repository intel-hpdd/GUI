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

export default {
  template: `
    <div as-value stream="::$ctrl.mgtStream">
      <div ng-if="curr.val.length > 0" class="mgt-component">
        <h4 class="section-header">MGTs</h4>
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>File Systems</th>
              <th>Volume WWID</th>
              <th>Primary Server</th>
              <th>Failover Server</th>
              <th>Started on</th>
              <th>Actions</th>
            </tr>
            <tbody>
              <tr ng-repeat="item in curr.val track by item.id">
                <td>
                  <a route-to="{{ 'configure/mgt/' + item.id }}">
                    <span>{{ ::item.ha_label }}</span>
                  </a>
                </td>
                <td>
                  <record-state display-type="'medium'"
                    record-id="::item.resource_uri" alert-stream="::$ctrl.alertIndicatorStream"></record-state>
                  <job-status record-id="::item.resource_uri" job-stream="::$ctrl.jobIndicatorStream"></job-status>
                </td>
                <td class="comma-list">
                  <a ng-repeat="fs in item.filesystems track by fs.id"
                    route-to="configure/filesystem/{{::fs.id}}">{{::fs.name}}
                  </a>
                </td>
                <td>{{item.volume_name}}</td>
                <td>
                  <a
                  route-to="configure/server/{{ item.primary_server | extractApi }}">{{ item.primary_server_name }}</a>
                </td>
                <td>{{item.failover_server_name}}</td>
                <td>{{item.active_host_name}}</td>
                <td as-stream val="item">
                  <action-dropdown stream="::str"></action-dropdown>
                </td>
              </tr>
            </tbody>
          </thead>
        </table>
      </div>
    </div>
`,
  controller () {
    this.$onDestroy = () => {
      this.mgtStream.destroy();
      this.alertIndicatorStream.destroy();
      this.jobIndicatorStream.destroy();
    };
  },
  bindings: {
    mgtStream: '<',
    alertIndicatorStream: '<',
    jobIndicatorStream: '<'
  }
};
