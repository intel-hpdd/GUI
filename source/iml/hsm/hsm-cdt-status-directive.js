//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default function hsmCdtStatusDirective() {
  return {
    scope: {
      fileSystem: "=",
      locks: "<"
    },
    restrict: "E",
    template: `<div class="cdt-status-component detail-panel">
  <h4 class="section-header">File System Configuration</h4>

  <div class="detail-row">
    <div>Coordinator Status:</div>
    <div ng-switch="fileSystem.cdt_status">
      <span ng-switch-when="disabled">
        <i class="fa fa-exclamation-circle text-danger"></i>
        <span class="status-text">Disabled</span>
      </span>
      <span ng-switch-when="enabled">
        <i class="fa fa-check-circle text-success"></i>
        <span class="status-text">Enabled</span>
      </span>
      <span ng-switch-when="null">
        <i class="fa fa-exclamation-circle text-danger"></i>
        <span class="status-text">Unknown</span>
      </span>
      <span ng-switch-when="shutdown">
        <i class="fa fa-minus-circle"></i>
        <span class="status-text">Shut Down</span>
      </span>
    </div>
  </div>
  <div>
    <hsm-action-dropdown locks="locks" record="fileSystem" tooltip-placement="top"></hsm-action-dropdown>
  </div>
</div>
`
  };
}
