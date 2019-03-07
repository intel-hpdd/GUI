// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import { type localApplyT } from "../extend-scope-module.js";
import fetchApi from "../fetch-api.js";

export function DeferredActionDropdownCtrl($scope: Object, localApply: localApplyT<any>): void {
  "ngInject";

  const ctrl = this;

  ctrl.records = [];
  ctrl.onEnter = fp.once(async () => {
    ctrl.records = await Promise.all(ctrl.row.affected.map(x => fetchApi(x)));
    localApply($scope);
  });
}

export const deferredActionDropdownComponent = {
  bindings: {
    row: "=",
    locks: "<"
  },
  controller: DeferredActionDropdownCtrl,
  template: `
      <div ng-mouseenter="::$ctrl.onEnter()">
        <action-dropdown locks="$ctrl.locks" records="$ctrl.records" update="true"></action-dropdown>
      </div>`
};
