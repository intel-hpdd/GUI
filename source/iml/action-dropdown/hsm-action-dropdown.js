// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import global from "../global.js";

const initializeComponent = ({ record, locks, tooltipPlacement, tooltipSize }, div) => {
  const { hsm_action_dropdown_component: hsmActionDropdown } = global.wasm_bindgen;

  return hsmActionDropdown(
    {
      record,
      locks,
      tooltip_placement: tooltipPlacement,
      tooltip_size: tooltipSize
    },
    div
  );
};

export function HsmActionDropdownCtrl($element: HTMLElement[]) {
  "ngInject";

  const ctrl = this;

  const div = $element[0].querySelector("div");

  ctrl.seedApp = initializeComponent(ctrl, div);

  ctrl.$onChanges = changesObj => {
    if (ctrl.seedApp == null) return;

    if (changesObj.locks != null) ctrl.seedApp.set_locks(changesObj.locks.currentValue);

    if (changesObj.record != null) ctrl.seedApp.set_hsm_record(changesObj.record.currentValue);
  };

  ctrl.$onDestroy = () => {
    if (ctrl.seedApp) {
      ctrl.seedApp.destroy();
      ctrl.seedApp.free();
    }
  };
}

export const hsmActionDropdown = {
  bindings: {
    tooltipPlacement: "@?",
    tooltipSize: "@?",
    record: "<?",
    locks: "<"
  },
  controller: HsmActionDropdownCtrl,
  template: `<div></div>`
};
