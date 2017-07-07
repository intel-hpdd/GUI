//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';

export function ConfirmActionModalCtrl($scope, title, confirmPrompts) {
  'ngInject';
  $scope.confirmAction = {
    title,
    confirmPrompts
  };
}

export function openConfirmActionModalFactory($uibModal) {
  'ngInject';
  return function openConfirmActionModal(title, confirmPrompts) {
    return $uibModal.open({
      template: `<div class="modal-header">
  <h4 class="modal-title">Confirm {{ confirmAction.title }}</h4>
</div>
<div class="modal-body">
  <div class="single-confirmation" ng-if="confirmAction.confirmPrompts.length === 1">
    <p>{{ confirmAction.confirmPrompts[0] }}</p>
  </div>
  <div class="multi-confirmation" ng-if="confirmAction.confirmPrompts.length > 1">
    <h4>This action will:</h4>
    <ul class="well">
      <li ng-repeat="message in confirmAction.confirmPrompts">{{ message }}</li>
    </ul>
  </div>
  <div ng-if="confirmAction.confirmPrompts.length === 0">
    <p>Are you sure you want to perform this action?</p>
  </div>
</div>
<div class="modal-footer">
  <div class="btn-group" uib-dropdown>
    <button type="button" ng-click="$close(false)" class="btn btn-success">
      Confirm <i class="fa fa-check-circle-o"></i>
    </button>
    <button type="button" class="btn btn-success" uib-dropdown-toggle>
      <span class="caret"></span>
      <span class="sr-only">Split button</span>
    </button>
    <ul uib-dropdown-menu role="menu">
      <li>
        <a ng-click="$close(true)">Confirm and skip command view</a>
      </li>
    </ul>
  </div>
  <button class="btn btn-danger" ng-click="$dismiss('cancel')">Cancel <i class="fa fa-times-circle-o"></i></button>
</div>`,
      controller: 'ConfirmActionModalCtrl',
      windowClass: 'confirm-action-modal',
      backdropClass: 'confirm-action-modal-backdrop',
      backdrop: 'static',
      resolve: {
        title: fp.always(title),
        confirmPrompts: fp.always(confirmPrompts)
      }
    });
  };
}
