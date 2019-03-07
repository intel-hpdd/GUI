// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import global from "../global.js";

import type { $scopeT, $locationT } from "angular";

import { UI_ROOT } from "../environment.js";
import getStore from "../store/get-store.js";

import { type LockT } from "../locks/locks-reducer.js";
import { handleSelectedAction } from "../listeners.js";

export default {
  bindings: {
    path: "@",
    params: "<"
  },
  controller: function($element: HTMLElement[], $scope: $scopeT, $location: $locationT) {
    "ngInject";
    const frameShim = $element[0];
    const frame: HTMLIFrameElement = (frameShim.querySelector("iframe"): any);
    this.src = `${UI_ROOT}${this.path}`;
    frameShim.classList.add("loading");

    if (this.params.id) this.src += `/${this.params.id}`;

    const onLoad = () => {
      frameShim.classList.remove("loading");
      $scope.$apply();

      getStore
        .select("locks")
        .map((xs: LockT) => ({ ...xs }))
        .each(locks => {
          if (frame.contentWindow != null) frame.contentWindow.postMessage(JSON.stringify(locks), "*");
        });
    };

    const token = setInterval(() => {
      if (!frame.contentDocument) return;

      const body = frame.contentDocument.body;

      if (body) frame.style.height = body.scrollHeight + "px";
    }, 200);

    const onMessage = ev => {
      const json = JSON.parse(ev.data);

      switch (json.type) {
        case "navigation":
          $location.path(json.url);
          $scope.$apply();
          break;
        case "action_selected":
          handleSelectedAction(json.detail);
          break;
      }
    };

    frameShim.addEventListener("load", onLoad, true);
    global.addEventListener("message", onMessage, false);

    this.$onDestroy = () => {
      frameShim.removeEventListener("load", onLoad, true);
      global.removeEventListener("message", onMessage, false);
      clearInterval(token);
    };
  },
  template: `
    <iframe ng-src="{{::$ctrl.src}}"></iframe>
  `
};
