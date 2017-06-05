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

export default function LoginCtrl(
  $uibModal,
  $q,
  SessionModel,
  help,
  navigate,
  ALLOW_ANONYMOUS_READ
) {
  'ngInject';
  function initializeEulaDialog(user) {
    return $uibModal.open({
      template: `<div class="modal-header">
  <h3>End User License Agreement Terms</h3>
</div>
<div class="modal-body eula">
  <div class="well" at-scroll-boundary one-hit="{{ true }}" ng-bind-html="eulaCtrl.eula"></div>
</div>
<div class="modal-footer">
  <button class="btn btn-success" ng-disabled="!hitBoundary" ng-click="eulaCtrl.accept()">Agree</button>
  <button class="btn btn-danger" ng-click="eulaCtrl.reject()">Do Not Agree</button>
</div>`,
      controller: 'EulaCtrl',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'eula-modal',
      resolve: {
        user: () => user
      }
    }).result;
  }

  const initializeDeniedDialog = function initializeDeniedLoginFn() {
    return $uibModal.open({
      template: `<div class="modal-header">
    <h3><i class="fa fa-ban"></i> Access Denied</h3>
</div>
<div class="modal-body access-denied">{{ accessDeniedCtrl.message }}</div>`,
      controller: 'AccessDeniedCtrl',
      backdrop: 'static',
      keyboard: false,
      resolve: {
        message: () => help.get('access_denied_eula')
      }
    }).result;
  }.bind(this);

  /**
   * Submits the login, calling nextStep if successful.
   */
  this.submitLogin = function submitLogin() {
    this.inProgress = true;
    this.validate = SessionModel.login(this.username, this.password)
      .$promise.then(function(session) {
        return session.user.actOnEulaState(
          initializeEulaDialog,
          initializeDeniedDialog
        );
      })
      .then(() => navigate())
      .catch(function(reason) {
        if (reason === 'dismiss') return SessionModel.delete().$promise;

        return $q.reject(reason);
      })
      .finally(
        function() {
          this.inProgress = false;
        }.bind(this)
      );
  };

  this.ALLOW_ANONYMOUS_READ = ALLOW_ANONYMOUS_READ;
  this.goToIndex = navigate;
}
