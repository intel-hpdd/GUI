// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import global from "../global.js";

function Controller($element) {
  "ngInject";

  const { render_fs_detail_page: renderFsDetailPage } = global.wasm_bindgen;

  let onCloseCommandModal;

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

    // start fetching the inode table immediately
    this.seedApp.fetch_inode_table();

    onCloseCommandModal = () => {
      this.seedApp.close_command_modal();
    };

    global.addEventListener("close_command_modal", onCloseCommandModal);
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

    global.removeEventListener("close_command_modal", onCloseCommandModal);
  };
}

export default {
  bindings: {
    fileSystem$: "<",
    target$: "<",
    server$: "<",
    alertIndicator$: "<",
    locks$: "<",
    stratagemConfiguration$: "<"
  },
  controller: Controller,
  template: `
    <div class="container container-full">
      <div class="mount-point"></div>
    </div>`
};
