//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';
import deferredCmdModalBtnTemplate
  from './assets/html/deferred-cmd-modal-btn.html!text';

export const deferredCmdModalBtnDirective = fp.always({
  scope: {},
  bindToController: {
    resourceUri: '='
  },
  controller: 'DeferredCommandModalBtnCtrl',
  controllerAs: 'ctrl',
  template: deferredCmdModalBtnTemplate
});
