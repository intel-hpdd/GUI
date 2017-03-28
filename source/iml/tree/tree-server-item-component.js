// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { toggleItem } from './tree-utils.js';

function treeServerItem() {
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
    <a ui-sref="app.serverDetail({ id: $ctrl.record.id, resetState: true })">
      <i class="fa fa-fw fa-server"></i> {{::$ctrl.record.fqdn}}
    </a>
    <a class="dashboard-link" ui-sref="app.dashboard.server({ id: $ctrl.record.id, resetState: true })">
      <i class="fa fa-bar-chart-o"></i>
    </a>
    <div class="children" ng-if="$ctrl.parent.opens[$ctrl.record.id]">
      <tree-volume-collection
        parent-id="$ctrl.parent.id"
        host-id="$ctrl.record.id"
      ></tree-volume-collection>
    </div>
  `
};
