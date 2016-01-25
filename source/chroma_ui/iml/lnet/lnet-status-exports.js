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

import {lensProp, maybe} from 'intel-fp/fp';

export default {
  bindings: {
    stream: '='
  },
  controller ($scope, propagateChange) {
    'ngInject';

    this.stream
      .map(maybe(lensProp('state')))
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
