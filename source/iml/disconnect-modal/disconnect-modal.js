// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import windowUnload from '../window-unload.js';

export default function disconnectModalFactory($uibModal: Object, $timeout: Function) {
  'ngInject';
  const options = {
    backdrop: 'static',
    keyboard: false,
    template: `
    <div>
      <div class="modal-body disconnect-modal">
        <h3>Disconnected From Server, Retrying. <i class="fa fa-spinner fa-spin fa-lg"></i></h3>
      </div>
    </div>`,
    windowClass: 'disconnect-modal'
  };

  let modal;
  function close() {
    $timeout(() => {
      if (modal) modal.close();

      modal = null;
    });
  }

  function open() {
    $timeout(() => {
      if (!windowUnload.unloading && !modal) modal = $uibModal.open(options);
    });
  }

  return {
    open,
    close
  };
}
