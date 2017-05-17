//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import * as fp from '@mfl/fp';

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
