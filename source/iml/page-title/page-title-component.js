// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { getResolvedData } from '../route-utils.js';

import * as maybe from '@iml/maybe';

import type { TransitionT, StateServiceT } from 'angular-ui-router';

const defaultToObj = maybe.withDefault.bind(null, () => ({}));

export default {
  controller: function($state: StateServiceT, $transitions: TransitionT) {
    'ngInject';
    const ctrl = this;
    const route = $state.router.globals.$current;
    const resolvedData = defaultToObj(getResolvedData($state.transition, 'getData'));

    ctrl.page = {
      ...resolvedData,
      ...route.data
    };

    const destroyOnBefore = $transitions.onStart({}, () => (ctrl.loading = true));

    const destroyOnSuccess = $transitions.onSuccess({}, (transition: TransitionT) => {
      ctrl.loading = false;

      const resolvedData = defaultToObj(getResolvedData(transition, 'getData'));

      ctrl.page = {
        ...resolvedData,
        ...transition.to().data
      };
    });

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
