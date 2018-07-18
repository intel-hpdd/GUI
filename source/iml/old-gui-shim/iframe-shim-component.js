// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import global from '../global.js';

import type { $scopeT, $locationT } from 'angular';

import { UI_ROOT } from '../environment.js';

export default {
  bindings: {
    path: '@',
    params: '<'
  },
  controller: function($element: HTMLElement[], $scope: $scopeT, $location: $locationT) {
    'ngInject';
    const frameShim = $element[0];
    const frame: HTMLIFrameElement = (frameShim.querySelector('iframe'): any);
    this.src = `${UI_ROOT}${this.path}`;
    frameShim.classList.add('loading');

    if (this.params.id) this.src += `/${this.params.id}`;

    const onLoad = () => {
      frameShim.classList.remove('loading');
      $scope.$apply();
    };

    const token = setInterval(() => {
      if (!frame.contentDocument) return;

      const body = frame.contentDocument.body;

      if (body) frame.style.height = body.scrollHeight + 'px';
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
