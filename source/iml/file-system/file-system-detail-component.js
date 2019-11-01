// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import global from "../global.js";

function Controller($element) {
  "ngInject";

  const { render_fs_detail_page: renderFsDetailPage } = global.wasm_bindgen;

  let onCommandModalClosed;

  this.$onInit = () => {
    const el = $element[0].querySelector(".mount-point");
    this.seedApp = renderFsDetailPage(el);

    this.fileSystem$.each(x => {
      this.seedApp.set_filesystem(x);
    });

    this.target$.each(x => {
      this.seedApp.set_targets(x);
    });

    this.server$.each(x => {
      this.seedApp.set_hosts(x);
    });

    this.alertIndicator$.each(x => {
      this.seedApp.set_alerts(x);
    });

    this.locks$.each(x => {
      this.seedApp.set_locks(x);
    });

    this.stratagemConfiguration$.each(x => {
      this.seedApp.set_stratagem_configuration(x);
    });

    this.metricPoll$.each(x => {
      console.log("metric data: ", x);
    });

    // start fetching the inode table immediately
    this.seedApp.fetch_inode_table();

    onCommandModalClosed = () => {
      this.seedApp.command_modal_closed();
    };

    global.addEventListener("close_command_modal", onCommandModalClosed);
  };

  this.$onDestroy = () => {
    if (this.seedApp) {
      this.seedApp.destroy();
      this.seedApp.free();
    }

    this.fileSystem$.destroy();
    this.target$.destroy();
    this.server$.destroy();
    this.alertIndicator$.destroy();
    this.locks$.destroy();
    this.stratagemConfiguration$.destroy();
    this.metricPoll$.destroy();

    global.removeEventListener("close_command_modal", onCommandModalClosed);
  };
}

export default {
  bindings: {
    fileSystem$: "<",
    target$: "<",
    server$: "<",
    alertIndicator$: "<",
    locks$: "<",
    stratagemConfiguration$: "<",
    metricPoll$: "<"
  },
  controller: Controller,
  template: `
    <div class="container container-full">
      <div class="mount-point"></div>
    </div>`
};
