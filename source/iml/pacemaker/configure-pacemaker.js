//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";

export default function configurePacemaker() {
  return {
    restrict: "E",
    scope: {},
    bindToController: {
      stream: "=",
      alertStream: "=",
      locks: "<"
    },
    controller: fp.noop,
    controllerAs: "ctrl",
    template: `<div as-viewer stream="::ctrl.stream" name="'value'">
  <div as-value stream="::value">
    <div ng-if="curr.val" class="configure-pacemaker detail-panel">
      <h4 class="section-header">Pacemaker Configuration</h4>

      <div class="detail-row">
        <div>State:</div>
        <div as-viewer stream="::ctrl.stream">
          <pacemaker-state stream="::viewer"></pacemaker-state>
        </div>
      </div>

      <div class="detail-row">
        <div>Alerts:</div>
        <div>
          <record-state record-id="curr.val.resource_uri" alert-stream="::ctrl.alertStream" display-type="'medium'"></record-state>
          <job-status content-type-id="curr.val.content_type_id" record-id="curr.val.id" locks="ctrl.locks"></job-status>
        </div>
      </div>

      <div>
        <action-dropdown locks="ctrl.locks" tooltip-placement="top" record="curr.val"></action-dropdown>
      </div>
    </div>
  </div>
</div>`
  };
}
