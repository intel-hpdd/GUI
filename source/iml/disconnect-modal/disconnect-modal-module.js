// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import disconnectModal from './disconnect-modal';
import uiBootstrapModule from 'angular-ui-bootstrap';
import disconnectListener from './disconnect-listener.js';
import windowUnloadModule from '../window-unload/window-unload-module.js';

export default angular
  .module('disconnectModalModule', [uiBootstrapModule, windowUnloadModule])
  .factory('disconnectModal', disconnectModal)
  .run(disconnectModal => {
    'ngInject';
    disconnectListener.on('open', disconnectModal.open);
    disconnectListener.on('close', disconnectModal.close);
  }).name;
