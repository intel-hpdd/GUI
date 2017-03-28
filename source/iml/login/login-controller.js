//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';

import eulaTemplate from './assets/html/eula.html!text';
import accessDeniedTemplate
  from '../access-denied/assets/html/access-denied.html!text';

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
      template: eulaTemplate,
      controller: 'EulaCtrl',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'eula-modal',
      resolve: {
        user: fp.always(user)
      }
    }).result;
  }

  const initializeDeniedDialog = function initializeDeniedLoginFn() {
    return $uibModal.open({
      template: accessDeniedTemplate,
      controller: 'AccessDeniedCtrl',
      backdrop: 'static',
      keyboard: false,
      resolve: {
        message: fp.always(help.get('access_denied_eula'))
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
