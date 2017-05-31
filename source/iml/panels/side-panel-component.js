//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

// @flow

export function Controller ($element:HTMLElement[]) {
  'ngInject';

  this.$onInit = () => {
    const s = $element[0].style;

    const setWidth = (x) => {
      s['flex-basis'] = `${x.sideWidthPercentage}%`;
    };

    this.rootPanel.register(setWidth);

    this.$onDestroy = () => {
      this.rootPanel.deregister(setWidth);
    };
  };
}

export default {
  require: {
    rootPanel: '^rootPanel'
  },
  controller: Controller
};
