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
