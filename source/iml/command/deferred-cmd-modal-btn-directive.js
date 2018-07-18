//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';

export const deferredCmdModalBtnDirective = fp.always({
  scope: {},
  bindToController: {
    resourceUri: '='
  },
  controller: 'DeferredCommandModalBtnCtrl',
  controllerAs: 'ctrl',
  template: `<button class="btn btn-sm btn-default loading-btn" disabled ng-if="ctrl.loading">
  <i class="fa fa-spinner fa-spin"></i>Waiting
</button>
<button ng-click="::ctrl.openCommandModal()" class="btn btn-sm btn-default cmd-detail-btn" ng-if="!ctrl.loading">
  <i class="fa fa-list-alt"></i>Details
</button>`
});
