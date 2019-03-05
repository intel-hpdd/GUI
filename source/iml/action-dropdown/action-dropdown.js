// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import global from "../global.js";
import getRandomValue from "../get-random-value.js";

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

export function ActionDropdownCtrl($element: HTMLElement[]) {
  "ngInject";

  const ctrl = this;
  ctrl.uuid = getRandomValue().toString();

  const div = $element[0].querySelector("div");

  if (div != null) div.id = ctrl.uuid;

  if (ctrl.update === true) ctrl.seedApp = initializeComponent(ctrl);

  ctrl.records = Array.isArray(ctrl.records) ? ctrl.records : [ctrl.records];

  if (ctrl.seedApp != null) {
    const hsmRecords = ctrl.records.filter(x => x.hsm_control_params != null);
    const normalRecords = ctrl.records.filter(x => x.hsm_control_params == null);

    if (hsmRecords.length > 0) ctrl.seedApp.set_hsm_records(hsmRecords);
    if (ctrl.update === true && normalRecords.length > 0) ctrl.seedApp.set_records(normalRecords);
  } else {
    ctrl.seedApp = initializeComponent(ctrl);
  }

  ctrl.$onChanges = changesObj => {
    if (ctrl.seedApp != null) {
      ctrl.locks = changesObj.locks ? changesObj.locks.currentValue : ctrl.locks;
      ctrl.records = changesObj.records ? changesObj.records.currentValue : ctrl.records;

      if (changesObj.locks != null) ctrl.seedApp.set_locks(ctrl.locks);
      if (changesObj.records != null && ctrl.records.length > 0) ctrl.seedApp.set_records(ctrl.records);
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
    records: "<",
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
