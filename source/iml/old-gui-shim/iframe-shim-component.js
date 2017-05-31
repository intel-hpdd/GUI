// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

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
    const frame = frameShim.querySelector('iframe');
    this.loading = true;
    this.src = `${UI_ROOT}${this.path}`;

    if (this.params.id)
      this.src += `/${this.params.id}`;

    const onLoad = () => {
      this.loading = false;
      $scope.$apply();
    };

    const token = setInterval(() => {
      const body = frame
        .contentWindow
        .document
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
    <h2 ng-if="$ctrl.loading" class="loading-page text-center">Loading <i class="fa fa-spinner fa-spin fa-lg"></i></h2>
    <iframe ng-src="{{::$ctrl.src}}"></iframe>
  `
};
