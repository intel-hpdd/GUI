// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import global from "../global.js";

const initializeComponent = ({ records, locks, flag, tooltipPlacement, tooltipSize }, div) => {
  const { init } = global.wasm_bindgen;
  return init(
    {
      records,
      locks,
      flag,
      tooltip_placement: tooltipPlacement,
      tooltip_size: tooltipSize
    },
    div
  );
};

export function ActionDropdownCtrl($element: HTMLElement[]) {
  "ngInject";

  const ctrl = this;

  const div = $element[0].querySelector("div");

  // Initialize the component before setting records if the component will be updated.
  // Components will be updated on the status page.
  const initialRecords = Array.isArray(ctrl.records) ? ctrl.records : [ctrl.records];
  const hsmRecords = initialRecords.filter(x => x.hsm_control_params != null);
  const normalRecords = initialRecords.filter(x => x.hsm_control_params == null);
  if (ctrl.update === true || hsmRecords.length > 0) {
    ctrl.records = [];
    ctrl.seedApp = initializeComponent(ctrl, div);

    if (hsmRecords.length > 0) ctrl.seedApp.set_hsm_records(hsmRecords);
    if (ctrl.update === true && normalRecords.length > 0) ctrl.seedApp.set_records(normalRecords);
  } else {
    ctrl.records = initialRecords;
    ctrl.seedApp = initializeComponent(ctrl, div);
  }

  ctrl.$onChanges = changesObj => {
    if (ctrl.seedApp != null) {
      ctrl.locks = changesObj.locks ? changesObj.locks.currentValue : ctrl.locks;
      if (changesObj.locks != null) ctrl.seedApp.set_locks(ctrl.locks);

      // Only set records if update is true. Don't worry about hsm as it will never be updated.
      if (ctrl.update === true && changesObj.records != null && ctrl.records.length > 0)
        ctrl.seedApp.set_records(ctrl.records);
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
