// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.


export default {
  bindings: {
    record: '<',
    fsId: '<',
    kind: '<'
  },
  template: `
    <a ui-sref="app.oldTarget({ id: $ctrl.record.id, resetState: true })">
      <i class="fa fa-bullseye"></i> {{::$ctrl.record.label}}
    </a>
    <a
      ng-if="$ctrl.kind !== 'mgt'"
      class="dashboard-link"
      ui-sref="{{'app.dashboard.' + $ctrl.kind + '({ id: $ctrl.record.id, resetState: true })'}}"
    >
      <i class="fa fa-bar-chart-o"></i>
    </a>
  `
};
