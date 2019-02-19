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

export default function DeferredCommandModalBtnCtrl($scope: $scopeT, localApply: localApplyT<*>) {
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
