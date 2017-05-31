//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import {
  lensProp,
  view,
  maybe
} from 'intel-fp';

export default {
  bindings: {
    stream: '<'
  },
  controller ($scope, propagateChange) {
    'ngInject';

    this
      .stream
      .map(maybe(view(lensProp('state'))))
      .through(propagateChange($scope, this, 'state'));
  },
  template: `
<span>
  <span ng-if="$ctrl.state === null">
    <i class="fa fa-plug text-warning"></i> Unknown
  </span>
  <span ng-if="$ctrl.state === 'lnet_up'">
    <i class="fa fa-plug text-success"></i> LNet Up
  </span>
  <span ng-if="$ctrl.state === 'lnet_down'">
    <i class="fa fa-plug text-danger"></i> LNet Down
  </span>
  <span ng-if="$ctrl.state === 'lnet_unloaded'">
    <i class="fa fa-plug text-warning"></i> LNet Unloaded
  </span>
  <span ng-if="$ctrl.state === 'configured'">
    <i class="fa fa-plug text-info"></i> Configured
  </span>
  <span ng-if="$ctrl.state === 'unconfigured'">
    <i class="fa fa-plug"></i> Unconfigured
  </span>
  <span ng-if="$ctrl.state === 'undeployed'">
    <i class="fa fa-plug"></i> Undeployed
  </span>
</span>
`
};
