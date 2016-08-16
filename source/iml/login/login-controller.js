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

import {
  always
} from 'intel-fp';

// $FlowIgnore: HTML templates that flow does not recognize.
import eulaTemplate from './assets/html/eula.html!text';

// $FlowIgnore: HTML templates that flow does not recognize.
import accessDeniedTemplate from '../access-denied/assets/html/access-denied.html!text';

export default function LoginCtrl ($uibModal, $q, SessionModel, help, navigate, ALLOW_ANONYMOUS_READ) {
  'ngInject';

  function initializeEulaDialog (user) {
    return $uibModal.open({
      template: eulaTemplate,
      controller: 'EulaCtrl',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'eula-modal',
      resolve: {
        user: always(user)
      }
    }).result;
  }

  var initializeDeniedDialog = function initializeDeniedLoginFn () {
    return $uibModal.open({
      template: accessDeniedTemplate,
      controller: 'AccessDeniedCtrl',
      backdrop: 'static',
      keyboard: false,
      resolve: {
        message: always(help.get('access_denied_eula'))
      }
    }).result;
  }.bind(this);

  /**
   * Submits the login, calling nextStep if successful.
   */
  this.submitLogin = function submitLogin () {
    this.inProgress = true;

    this.validate = SessionModel.login(this.username, this.password).$promise
    .then(function (session) {
      return session.user.actOnEulaState(initializeEulaDialog, initializeDeniedDialog);
    })
    .then(() => navigate())
    .catch(function (reason) {
      if (reason === 'dismiss')
        return SessionModel.delete().$promise;

      return $q.reject(reason);
    })
    .finally(function () {
      this.inProgress = false;
    }.bind(this));
  };

  this.ALLOW_ANONYMOUS_READ = ALLOW_ANONYMOUS_READ;
  this.goToIndex = navigate;
}
