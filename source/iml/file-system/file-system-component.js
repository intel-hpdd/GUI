// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default {
  bindings: {
    fileSystem$: '<',
    alertIndicator$: '<',
    jobIndicator$: '<'
  },
  controller () {
    this.$onDestroy = () => {
      this.fileSystem$.destroy();
      this.alertIndicator$.endBroadcast();
      this.jobIndicator$.endBroadcast();
    };
  },
  template: `
<div class="file-systems" as-value stream="::$ctrl.fileSystem$">
  <div class="no-fs well text-center" ng-if="curr.val.length === 0">
    <h1>No File Systems are configured</h1>
      <a
        type="button"
        class="btn btn-success btn-lg"
        route-to="configure/filesystem/create/"
      >
        <i class="fa fa-plus-circle"></i>Create File System
      </a>
  </div>
  <div ng-if="curr.val.length > 0" class="file-system-component">
    <h4 class="section-header">File Systems</h4>
    <table class="table">
      <thead>
        <tr>
          <th>File System</th>
          <th>Status</th>
          <th>Primary Management Server</th>
          <th>Metadata Server Count</th>
          <th>Connected Clients</th>
          <th>Space Used / Total</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr ng-repeat="item in curr.val track by item.id">
          <td>
            <a route-to="{{ 'configure/filesystem/' + item.id }}">
              <span>{{ ::item.name }}</span>
            </a>
          </td>
          <td>
            <record-state display-type="'medium'"
              record-id="::item.resource_uri" alert-stream="::$ctrl.alertIndicator$"></record-state>
            <job-status record-id="::item.resource_uri" job-stream="::$ctrl.jobIndicator$"></job-status>
          </td>
          <td>
            <a route-to="configure/server/{{item.mgt.primary_server | extractApi}}" >
              {{::item.mgt.primary_server_name}}
            </a>
          </td>
          <td>
            {{item.mdts.length}}
          </td>
          <td>
            {{item.client_count}}
          </td>
          <td as-stream val="item">
            <usage-info stream="::str" id="item.id" prefix="bytes"></usage-info>
          </td>
          <td as-stream val="item">
            <action-dropdown stream="::str"></action-dropdown>
          </td>
        </tr>
      </tbody>
    </table>
    <a
      type="button"
      class="btn btn-default add-fs-button btn-sm"
      route-to="configure/filesystem/create/"
    >
      <i class="fa fa-plus-circle text-success"></i> Create More File Systems
    </a>
  </div>
</div>
`
};
