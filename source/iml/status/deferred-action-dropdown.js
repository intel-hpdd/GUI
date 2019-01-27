// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from "highland";
import * as fp from "@iml/fp";
import socketStream from "../socket/socket-stream.js";
import multiStream from "../multi-stream.js";

import type { HighlandStreamT } from "highland";
import type { LockT } from "../locks/locks-reducer.js";

export function DeferredActionDropdownCtrl($scope: Object, localApply: Function): void {
  "ngInject";
  const ctrl = this;
  const getActions = fp.map((x: string) =>
    socketStream(x, {
      jsonMask: "resource_uri,available_actions,locks,id,content_type_id,label"
    })
  );

  const getMs = fp.flow(
    getActions,
    multiStream
  );

  ctrl.ms = highland();

  ctrl.onEnter = fp.once(() => {
    ctrl.loading = true;

    const ms: HighlandStreamT<any[]> = getMs(ctrl.row.affected);

    ms.tap(() => (ctrl.loading = false))
      .tap(localApply.bind(null, $scope))
      .pipe(ctrl.ms);

    $scope.$on("$destroy", ms.destroy.bind(ms));
  });
}

export const deferredActionDropdownComponent = {
  bindings: {
    row: "=",
    locks: "<"
  },
  controller: "DeferredActionDropdownCtrl as ctrl",
  template: `
      <div ng-mouseenter="::ctrl.onEnter()">
        <button class="btn btn-sm btn-default loading-btn" disabled ng-if="ctrl.loading">
          <i class="fa fa-spinner fa-spin"></i>Waiting
        </button>
        <action-dropdown locks="ctrl.locks" ng-show="!ctrl.loading" stream="::ctrl.ms"></action-dropdown>
      </div>`
};
