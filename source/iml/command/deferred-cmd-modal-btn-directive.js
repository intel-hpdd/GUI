//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import {
  always
} from 'intel-fp';

// $FlowIgnore: HTML templates that flow does not recognize.
import deferredCmdModalBtnTemplate from './assets/html/deferred-cmd-modal-btn.html!text';

export const deferredCmdModalBtnDirective = always({
  scope: {},
  bindToController: {
    resourceUri: '='
  },
  controller: 'DeferredCommandModalBtnCtrl',
  controllerAs: 'ctrl',
  template: deferredCmdModalBtnTemplate
});
