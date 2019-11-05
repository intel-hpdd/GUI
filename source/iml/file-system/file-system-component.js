// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import global from "../global.js";

function Controller($element) {
  "ngInject";

  const { render_fs_page: render } = global.wasm_bindgen;

  this.$onInit = () => {
    const el = $element[0].querySelector(".mount-point");
    this.seedApp = render(el);

    this.target$.each(x => {
      this.seedApp.set_targets(x);
    });

    this.fileSystem$.each(x => {
      this.seedApp.set_filesystems(x);
    });

    this.alertIndicator$.each(x => {
      this.seedApp.set_alerts(x);
    });

    this.locks$.each(x => {
      this.seedApp.set_locks(x);
    });

    this.metricPoll$.each(x => {
      this.seedApp.set_polled_metrics(x);
    });
  };

  this.$onDestroy = () => {
    if (this.seedApp) {
      this.seedApp.destroy();
      this.seedApp.free();
    }

    this.fileSystem$.destroy();
    this.target$.destroy();
    this.alertIndicator$.destroy();
    this.locks$.destroy();
    this.metricPoll$.destroy();
  };
}

export default {
  bindings: {
    fileSystem$: "<",
    target$: "<",
    alertIndicator$: "<",
    locks$: "<",
    metricPoll$: "<"
  },
  controller: Controller,
  template: `<div class="mount-point"></div>`
};
