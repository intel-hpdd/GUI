// @flow

// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import global from "../global.js";

const initializeComponent = ({ locks, flag, tooltipPlacement, tooltipSize, urls }, div) => {
  const { multi_action_dropdown_component: actionDropdown } = global.wasm_bindgen;

  return actionDropdown(
    {
      locks,
      flag,
      urls,
      tooltip_placement: tooltipPlacement,
      tooltip_size: tooltipSize
    },
    div
  );
};

export function MultiDropdownCtrl($element: HTMLElement[]) {
  "ngInject";

  const ctrl = this;

  const div = $element[0].querySelector("div");

  ctrl.seedApp = initializeComponent(ctrl, div);

  ctrl.$onChanges = changesObj => {
    if (ctrl.seedApp != null && changesObj.locks != null) ctrl.seedApp.set_locks(changesObj.locks.currentValue);
  };

  ctrl.$onDestroy = () => {
    if (ctrl.seedApp) {
      ctrl.seedApp.destroy();
      ctrl.seedApp.free();
    }
  };
}

export const multiDropdown = {
  bindings: {
    locks: "<",
    flag: "@?",
    tooltipPlacement: "@?",
    tooltipSize: "@?",
    urls: "<?"
  },
  controller: MultiDropdownCtrl,
  template: `<div></div>`
};
