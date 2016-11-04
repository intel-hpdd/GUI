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

import {
  getResolvedData
} from '../route-utils.js';

import * as maybe from 'intel-maybe';

import type {
  TransitionT,
  StateServiceT
} from 'angular-ui-router';

const defaultToObj = maybe.withDefault(
  () => ({})
);

export default {
  controller: function ($state:StateServiceT, $transitions:TransitionT) {
    'ngInject';

    const ctrl = this;
    const route = $state.router.globals.$current;
    const resolvedData = defaultToObj(
      getResolvedData($state.transition, 'getData')
    );

    ctrl.page = {
      ...resolvedData,
      ...route.data
    };

    const destroyOnBefore = $transitions.onStart(
      {},
      () => ctrl.loading = true
    );

    const destroyOnSuccess = $transitions.onSuccess(
      {},
      (transition:TransitionT) => {
        ctrl.loading = false;

        const resolvedData = defaultToObj(
          getResolvedData(transition, 'getData')
        );

        ctrl.page = {
          ...resolvedData,
          ...transition.to().data
        };
      }
    );

    ctrl.$onDestroy = () => {
      destroyOnBefore();
      destroyOnSuccess();
    };
  },
  template: `
    <h3 ng-class="{loading: $ctrl.loading}">
      <i class="fa" ng-class="$ctrl.page.icon"></i>
      {{$ctrl.page.kind}}<span ng-if="$ctrl.page.label"> : </span>{{$ctrl.page.label}}
    </h3>
  `
};
