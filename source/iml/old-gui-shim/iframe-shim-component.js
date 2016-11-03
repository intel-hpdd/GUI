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

import global from '../global.js';

import type {
  $scopeT,
  $locationT
} from 'angular';

import {
  UI_ROOT
} from '../environment.js';

export default {
  bindings: {
    path: '@',
    params: '<'
  },
  controller: function ($element:HTMLElement[], $scope:$scopeT, $location:$locationT) {
    'ngInject';

    const frameShim = $element[0];
    const frame:HTMLIFrameElement = (frameShim.querySelector('iframe'):any);
    this.src = `${UI_ROOT}${this.path}`;
    frameShim.classList.add('loading');

    if (this.params.id)
      this.src += `/${this.params.id}`;

    const onLoad = () => {
      frameShim.classList.remove('loading');
      $scope.$apply();
    };

    const token = setInterval(() => {
      if (!frame.contentDocument)
        return;

      // $FlowFixMe: Track https://github.com/facebook/flow/pull/1783
      const body = frame
        .contentDocument
        .body;

      if (body)
        frame
          .style
          .height = body.scrollHeight + 'px';
    }, 200);

    const onMessage = ev => {
      $location.path(ev.data);
      $scope.$apply();
    };

    frameShim.addEventListener('load', onLoad, true);
    global.addEventListener('message', onMessage, false);

    this.$onDestroy = () => {
      frameShim.removeEventListener('load', onLoad, true);
      global.removeEventListener('message', onMessage, false);
      clearInterval(token);
    };
  },
  template: `
    <iframe ng-src="{{::$ctrl.src}}"></iframe>
  `
};
