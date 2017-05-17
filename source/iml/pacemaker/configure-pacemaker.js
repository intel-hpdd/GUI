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

import * as fp from '@mfl/fp';

export default function configurePacemaker() {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      stream: '=',
      alertStream: '=',
      jobStream: '='
    },
    controller: fp.noop,
    controllerAs: 'ctrl',
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
          <job-status record-id="curr.val.resource_uri" job-stream="::ctrl.jobStream"></job-status>
        </div>
      </div>

      <div as-viewer stream="::ctrl.stream">
        <action-dropdown tooltip-placement="top" stream="::viewer"></action-dropdown>
      </div>
    </div>
  </div>
</div>`
  };
}
