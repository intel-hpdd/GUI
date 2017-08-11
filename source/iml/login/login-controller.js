//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

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
  <div class="well" ng-bind-html="eulaCtrl.eula"></div>
</div>
<div class="modal-footer">
  <button class="btn btn-success" ng-click="eulaCtrl.accept()">Agree</button>
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
