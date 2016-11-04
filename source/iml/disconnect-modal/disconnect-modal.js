//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type {windowUnloadT} from '../window-unload/window-unload-module.js';

export default function disconnectModalFactory ($uibModal:Object, windowUnload:windowUnloadT, $timeout:Function) {
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
  function close () {
    $timeout(() => {
      if (modal)
        modal.close();

      modal = null;
    });
  }

  function open () {
    $timeout(() => {
      if (!windowUnload.unloading && !modal)
        modal = $uibModal.open(options);
    });
  }

  return {
    open,
    close
  };
}
