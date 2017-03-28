//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default function EulaCtrl($scope, $uibModalInstance, help, user) {
  'ngInject';
  function createAction(state) {
    const action = state ? 'close' : 'dismiss';

    return function() {
      user.accepted_eula = state;
      user
        .$update()
        .then($uibModalInstance[action].bind($uibModalInstance, action));
    };
  }

  $scope.eulaCtrl = {
    accept: createAction(true),
    reject: createAction(false),
    eula: help.get('eula')
  };
}
