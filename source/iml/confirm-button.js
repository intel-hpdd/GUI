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

import global from './global';

import type {
  jqliteElement,
  $scopeT
} from 'angular';

import type {
  localApplyT
} from './extend-scope-module.js';

const Controller = function Controller ($element:jqliteElement, $scope:$scopeT, localApply:localApplyT) {
  'ngInject';

  let ctrl = this;
  let removeResetListener;
  const resetDefault = () => {
    ctrl.default = true;
    localApply($scope);
    removeResetListener();
  };
  removeResetListener = () => global
    .removeEventListener('click', resetDefault, false);

  Object.assign(ctrl, {
    default: true,
    confirmed: false,
    onDefault (e:MouseEvent) {
      ctrl.default = false;
      e.stopPropagation();
      global.addEventListener('click', resetDefault, false);
    },
    onConfirm (e:MouseEvent) {
      ctrl.confirmed = true;
      e.stopPropagation();
      ctrl.confirmClick();
      removeResetListener();
    },
    $onDestroy: removeResetListener
  });
};


export default {
  controller: Controller,
  bindings: {
    confirmClick: '&'
  },
  transclude: {
    default: 'defaultButton',
    verify: 'verifyButton',
    waiting: 'waitingButton'
  },
  template: `
  <span ng-transclude="default" ng-if="$ctrl.default" ng-click="$ctrl.onDefault($event.originalEvent)"></span>
  <span ng-transclude="verify" ng-if="!$ctrl.default && !$ctrl.confirmed" ng-click="$ctrl.onConfirm($event.originalEvent)"></span>
  <span ng-transclude="waiting" ng-if="$ctrl.confirmed"></span>
  `
};
