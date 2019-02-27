// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import global from "../global.js";
import getRandomValue from "../get-random-value.js";

export function ActionDropdownCtrl($element: HTMLElement[]) {
  "ngInject";

  const ctrl = this;
  ctrl.uuid = getRandomValue().toString();
  ctrl.records = [];

  const div = $element[0].querySelector("div");

  const initializeComponent = ({ uuid, records, locks, flag, tooltipPlacement, tooltipSize }) => {
    const { init } = global.wasm_bindgen;
    return init({
      uuid,
      records,
      locks,
      flag,
      tooltip_placement: tooltipPlacement,
      tooltip_size: tooltipSize
    });
  };

  if (div != null) div.id = ctrl.uuid;

  if (ctrl.update === true) ctrl.seedApp = initializeComponent(ctrl);

  ctrl.stream
    .map(x => (Array.isArray(x) ? x : [x]))
    .take(1)
    .each(records => {
      ctrl.records = records;

      if (ctrl.update === true) ctrl.seedApp.set_records(ctrl.records);
      else ctrl.seedApp = initializeComponent(ctrl);
    });

  ctrl.$onChanges = changesObj => {
    if (ctrl.records != null) {
      ctrl.locks = changesObj.locks ? changesObj.locks.currentValue : ctrl.locks;

      if (changesObj.locks != null && ctrl.seedApp != null) ctrl.seedApp.set_locks(ctrl.locks);
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
    tooltipSize: "@?",
    actionsProperty: "@?",
    stream: "<",
    locks: "<",
    flag: "@?",
    update: "<?"
  },
  controller: ActionDropdownCtrl,
  template: `
<div>
</div>
`
};
