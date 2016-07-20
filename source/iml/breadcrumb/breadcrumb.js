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

import * as fp from 'intel-fp';
import global from '../global.js';

import {
  withDefault
} from 'intel-maybe';

import {
  getResolvedData
} from '../route-utils.js';

export type breadcrumbT = {
  name:string,
  params:Object,
  label?:string,
  kind:string,
  icon:string
};

export type breadcrumbDataT = {
  label?:string,
  kind?:string
}

import type {
  routeStateT
} from '../route-transitions.js';

import type {
  TransitionT,
  StateServiceT,
  StateParamsT
} from 'angular-ui-router';

const defaultToObj = withDefault(() => ({}));

const Controller = class {
  loaded:boolean = true;
  stack:Array<breadcrumbT> = [];
  poppedStateEvent:boolean;
  onSuccessEvent:boolean;
  originalStackLength:number;
  $onDestroy:Function;
  constructor ($transitions:TransitionT, $state:StateServiceT, $stateParams:StateParamsT) {
    'ngInject';

    const nodeStackLocation = (kind:string):number => {
      const item = fp.find(item => item.kind === kind, this.stack);
      return this.stack.indexOf(item);
    };

    const createBreadcrumb = (node:routeStateT, resolvedData:breadcrumbDataT):breadcrumbT => {
      let data = Object.assign({}, resolvedData, node.data);

      return {
        icon: data.icon,
        name: node.name,
        params: {
          ...$stateParams
        },
        label: data.label,
        kind: data.kind
      };
    };

    const updateStack = (route:routeStateT, resolvedData:breadcrumbDataT) => {
      let breadcrumb = createBreadcrumb(route, resolvedData);
      let stackIdx = nodeStackLocation(breadcrumb.kind);

      if ($stateParams.resetState || this.poppedStateEvent === true && stackIdx === -1)
        this.stack.length = 0;
      else if (stackIdx > -1)
        this.stack = this.stack.slice(0, stackIdx);

      this.stack.push(breadcrumb);
      this.poppedStateEvent = false;
    };

    const curRoute = $state.router.globals.$current;
    const data = defaultToObj(
      getResolvedData($state.transition, 'getData')
    );

    this.originalStackLength = this.stack.length;
    updateStack(curRoute, data);

    const destroyOnStart = $transitions.onStart(
      {},
      () => {
        this.poppedStateEvent = false;
        this.onSuccessEvent = false;
        this.loaded = false;

        return true;
      }
    );

    const destroyOnSuccess = $transitions.onSuccess({}, (transition) => {
      this.onSuccessEvent = true;
      this.loaded = true;

      const curRoute = transition.to();
      const data = defaultToObj(
        getResolvedData(transition, 'getData')
      );

      this.originalStackLength = this.stack.length;
      updateStack(curRoute, data);
    });

    const handlePopState = () => {
      this.poppedStateEvent = true;
      if (this.onSuccessEvent === true && this.stack.length > this.originalStackLength)
        this.stack = this.stack.slice(this.stack.length - 1);
    };

    global.addEventListener('popstate', handlePopState, false);

    this.$onDestroy = () => {
      destroyOnStart();
      destroyOnSuccess();
      global.removeEventListener('popstate', handlePopState, false);
    };
  }
};

export default {
  controller: Controller,
  template: `
<ol class="breadcrumb" ng-if="$ctrl.loaded">
  <li ng-repeat="breadcrumb in $ctrl.stack">
    <span ng-if="$last">
      <i class="fa" ng-class="breadcrumb.icon"></i> {{breadcrumb.kind}}<span ng-if="breadcrumb.label"> : </span>{{breadcrumb.label}}
    </span>
    <a ng-if="!$last" ui-state="breadcrumb.name" ui-state-params="breadcrumb.params">
      <i class="fa" ng-class="breadcrumb.icon"></i> {{breadcrumb.kind}}<span ng-if="breadcrumb.label"> : </span>{{breadcrumb.label}}
    </a>
  </li>
</ol>`
};
