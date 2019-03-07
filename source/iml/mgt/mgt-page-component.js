// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default {
  bindings: {
    mgt$: "<",
    mgtAlertIndicatorB: "<",
    locks$: "<"
  },
  template: `
    <div class="container container-full">
      <mgt
        mgt-$="$ctrl.mgt$"
        alert-indicator-b="$ctrl.mgtAlertIndicatorB"
        locks-$="$ctrl.locks$"
      ></mgt>
    </div>`
};
