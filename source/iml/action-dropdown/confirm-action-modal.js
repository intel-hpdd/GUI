//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import {always} from 'intel-fp';

// $FlowIgnore: HTML templates that flow does not recognize.
import confirmActionModalTemplate from './assets/html/confirm-action-modal.html!text';

export function ConfirmActionModalCtrl  ($scope, title, confirmPrompts) {
  'ngInject';

  $scope.confirmAction = {
    title,
    confirmPrompts
  };
}

export function openConfirmActionModalFactory ($uibModal) {
  'ngInject';

  return function openConfirmActionModal (title, confirmPrompts) {
    return $uibModal.open({
      template: confirmActionModalTemplate,
      controller: 'ConfirmActionModalCtrl',
      windowClass: 'confirm-action-modal',
      backdropClass: 'confirm-action-modal-backdrop',
      backdrop: 'static',
      resolve: {
        title: always(title),
        confirmPrompts: always(confirmPrompts)
      }
    });
  };
}
