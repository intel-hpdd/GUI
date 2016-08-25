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

import {
  toggleItem
} from './tree-utils.js';


function treeServerItem () {
  'ngInject';

  this.onOpen = toggleItem;
}

export default {
  controller: treeServerItem,
  bindings: {
    record: '<',
    parent: '<'
  },
  template: `
    <i
      class="fa fa-fw fa-chevron-right"
      ng-click="$ctrl.onOpen($ctrl.parent.treeId, $ctrl.record.id, !$ctrl.parent.opens[$ctrl.record.id])"
      ng-class="{'fa-rotate-90': $ctrl.parent.opens[$ctrl.record.id]}"
    ></i>
    <a ui-sref="app.oldFilesystemDetail({ id: $ctrl.record.id, resetState: true })">
      <i class="fa fa-fw fa-server"></i> {{::$ctrl.record.label}}
    </a>
    <a class="dashboard-link" ui-sref="app.dashboard.fs({ id: $ctrl.record.id, resetState: true })">
      <i class="fa fa-bar-chart-o"></i>
    </a>
    <div class="children" ng-if="$ctrl.parent.opens[$ctrl.record.id]">
      <tree-mgt-collection
        parent-id="$ctrl.parent.treeId"
        fs-id="$ctrl.record.id"
      ></tree-mgt-collection>
      <tree-mdt-collection
        parent-id="$ctrl.parent.treeId"
        fs-id="$ctrl.record.id"
      ></tree-mdt-collection>
      <tree-ost-collection
        parent-id="$ctrl.parent.treeId"
        fs-id="$ctrl.record.id"
      ></tree-ost-collection>
    </div>
  `
};