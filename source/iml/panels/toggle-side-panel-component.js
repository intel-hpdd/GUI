// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export function Controller() {
  'ngInject';
  let open = true;

  this.onClick = () => {
    open ? this.rootPanel.close() : this.rootPanel.open();
    open = !open;
  };
}

export default {
  require: {
    rootPanel: '^rootPanel'
  },
  controller: Controller,
  template: `
    <div ng-click="$ctrl.onClick()">
      <div class="side"></div>
      <div class="main"></div>
    </div>
  `
};
