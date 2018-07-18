// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { diffComponentCtrl } from './diff-component';

export default {
  bindings: {
    onMessage: '&'
  },
  require: {
    diffCtrl: '^differ'
  },
  controller: class {
    diffCtrl: diffComponentCtrl;
    reset: Function;
    state: Object;
    $onInit() {
      this.diffCtrl.subscribe(x => (this.state = x));

      this.reset = this.diffCtrl.reset;
    }
  },
  template: `
  <a class="clean-record"
    ng-if="$ctrl.state.status !== 'clean'"
    ng-click="$ctrl.reset()"
    tooltip-placement="left"
    uib-tooltip="{{ $ctrl.onMessage({state: $ctrl.state}); }}"
  >
    <i class="fa fa-times-circle"></i>
  </a>
  `
};
