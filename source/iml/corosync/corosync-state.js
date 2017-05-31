//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import {lensProp, safe, view} from 'intel-fp';

export default {
  bindings: {
    stream: '<'
  },
  controller ($scope, propagateChange) {
    'ngInject';

    this.stream
      .map(safe(1, view(lensProp('state')), null))
      .through(propagateChange($scope, this, 'state'));


    $scope.$on('$destroy', this.stream.destroy.bind(this.stream));
  },
  template: `
  <span>
    <span ng-if="$ctrl.state === 'started'">
      <i class="fa fa-plug text-success"></i> Corosync Started
    </span>
    <span ng-if="$ctrl.state === 'stopped'">
      <i class="fa fa-plug text-danger"></i> Corosync Stopped
    </span>
    <span ng-if="$ctrl.state === 'unconfigured'">
      <i class="fa fa-plug"></i> Unconfigured
    </span>
  </span>`
};
