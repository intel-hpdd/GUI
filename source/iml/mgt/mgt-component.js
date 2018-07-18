// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default {
  template: `
    <div as-value stream="::$ctrl.mgt$">
      <div class="no-mgt well text-center" ng-if="curr.val.length === 0">
        <h1>No MGTs are configured</h1>
          <a
            type="button"
            class="btn btn-success btn-lg"
            route-to="configure/filesystem/create/"
          >
            <i class="fa fa-plus-circle"></i>Create File System
          </a>
      </div>
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
                  <a route-to="{{ 'target/' + item.id }}">
                    <span>{{ ::item.ha_label }}</span>
                  </a>
                </td>
                <td>
                  <record-state display-type="'medium'"
                    record-id="::item.resource_uri" alert-stream="::$ctrl.alertIndicatorB"></record-state>
                  <job-status record-id="::item.resource_uri" job-stream="::$ctrl.jobIndicatorB"></job-status>
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
  controller() {
    this.$onDestroy = () => {
      this.mgt$.destroy();
      this.alertIndicatorB.endBroadcast();
      this.jobIndicatorB.endBroadcast();
    };
  },
  bindings: {
    mgt$: '<',
    alertIndicatorB: '<',
    jobIndicatorB: '<'
  }
};
