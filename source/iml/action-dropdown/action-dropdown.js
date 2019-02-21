// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import global from "../global.js";
import getRandomValue from "../get-random-value.js";

export function ActionDropdownCtrl($element: HTMLElement[]) {
  "ngInject";

  const ctrl = this;
  ctrl.uuid = getRandomValue().toString();

  const div = $element[0].querySelector("div");
  if (div != null) div.id = ctrl.uuid;

  ctrl.$onInit = () => {
    ctrl.stream
      .map(x => (Array.isArray(x) ? x : [x]))
      .take(1)
      .each(records => {
        ctrl.records = records;

        const { init } = global.wasm_bindgen;
        ctrl.seedApp = init({
          uuid: ctrl.uuid,
          records,
          locks: ctrl.locks,
          flag: ctrl.flag
        });
      });
  };

  ctrl.$onChanges = changesObj => {
    if (ctrl.records != null) {
      ctrl.locks = changesObj.locks ? changesObj.locks.currentValue : ctrl.locks;

      if (changesObj.locks != null) ctrl.seedApp.set_locks(ctrl.locks);
    }
  };

  ctrl.$onDestroy = () => {
    if (ctrl.seedApp) {
      ctrl.seedApp.destroy();
      ctrl.seedApp.free();
    }
  };
}

export const actionDropdown = {
  bindings: {
    tooltipPlacement: "@?",
    actionsProperty: "@?",
    stream: "<",
    locks: "<",
    flag: "@?"
  },
  controller: ActionDropdownCtrl,
  template: `
<div>
</div>
`
};
