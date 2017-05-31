// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import {
  getResolvedData
} from '../route-utils.js';

import {
  withDefault
} from 'intel-maybe';

import type {
  TransitionT,
  StateServiceT
} from 'angular-ui-router';

const defaultToObj = withDefault(() => ({}));

export default {
  controller: function ($state:StateServiceT, $transitions:TransitionT) {
    'ngInject';

    const route = $state.router.globals.$current;
    const resolvedData = defaultToObj(
      getResolvedData($state.transition, 'getData')
    );

    this.page = {
      ...resolvedData,
      ...route.data
    };

    const destroyOnBefore = $transitions.onExit(
      {},
      () => {
        this.loading = true;
      }
    );

    const destroyOnSuccess = $transitions.onSuccess(
      {},
      transition => {
        this.loading = false;

        const resolvedData = defaultToObj(
          getResolvedData(transition, 'getData')
        );

        this.page = {
          ...resolvedData,
          ...transition.to().data
        };
      }
    );

    this.$onDestroy = () => {
      destroyOnBefore();
      destroyOnSuccess();
    };
  },
  template: `
    <h3 ng-if="!$ctrl.loading">
      <i class="fa" ng-class="$ctrl.page.icon"></i>
      {{$ctrl.page.kind}}<span ng-if="$ctrl.page.label"> : </span>{{$ctrl.page.label}}
    </h3>
  `
};
