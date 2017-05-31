// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import {
  updateCollOffset
} from './tree-utils.js';

export default {
  bindings: {
    meta: '<',
    treeId: '<'
  },
  controller: function () {
    'ngInject';

    this.pageChange = (id, meta) => {
      updateCollOffset(id, (meta.current_page - 1) * meta.limit);
    };
  },
  template: `
    <ul uib-pager
       ng-if="$ctrl.meta.total_count > $ctrl.meta.limit"
       align="false"
       next-text="next ›"
       previous-text="‹ prev"
       items-per-page="$ctrl.meta.limit"
       total-items="$ctrl.meta.total_count"
       ng-change="$ctrl.pageChange($ctrl.treeId, $ctrl.meta)"
       ng-model="$ctrl.meta.current_page"
    ></ul>
  `
};
