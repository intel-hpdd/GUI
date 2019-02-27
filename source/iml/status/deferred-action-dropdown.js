// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from "highland";
import * as fp from "@iml/fp";
import socketStream from "../socket/socket-stream.js";
import multiStream from "../multi-stream.js";

import type { HighlandStreamT } from "highland";

export function DeferredActionDropdownCtrl($scope: Object, localApply: Function): void {
  "ngInject";
  const ctrl = this;
  const getActions = fp.map((x: string) => socketStream(x));

  const getMs = fp.flow(
    getActions,
    multiStream
  );

  ctrl.ms = highland();

  ctrl.onEnter = fp.once(() => {
    const ms: HighlandStreamT<any[]> = getMs(ctrl.row.affected);

    ms.pipe(ctrl.ms);

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
        <action-dropdown locks="ctrl.locks" stream="::ctrl.ms" update="true"></action-dropdown>
      </div>`
};
