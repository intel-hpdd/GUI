// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from "../socket/socket-stream.js";

import getStore from "../store/get-store.js";

import { SHOW_COMMAND_MODAL_ACTION } from "../command/command-modal-reducer.js";

import type { localApplyT } from "../extend-scope-module.js";
import type { $scopeT } from "angular";

function DeferredCommandModalBtnCtrl($scope: $scopeT, localApply: localApplyT<*>) {
  "ngInject";

  const setLoading = x => (this.loading = x);

  this.openCommandModal = () => {
    setLoading(true);

    const stream = socketStream(this.resourceUri);

    stream.each(x => {
      setLoading(false);
      stream.destroy();
      localApply($scope);

      getStore.dispatch({
        type: SHOW_COMMAND_MODAL_ACTION,
        payload: [x]
      });
    });
  };
}

export const deferredCmdModalBtnDirective = {
  bindings: {
    resourceUri: "<"
  },
  controller: DeferredCommandModalBtnCtrl,
  template: `<button class="btn btn-sm btn-default loading-btn" disabled ng-if="$ctrl.loading">
  <i class="fa fa-spinner fa-spin"></i>Waiting
</button>
<button ng-click="::$ctrl.openCommandModal()" class="btn btn-sm btn-default cmd-detail-btn" ng-if="!$ctrl.loading">
  <i class="fa fa-list-alt"></i>Details
</button>`
};

export default deferredCmdModalBtnDirective;
