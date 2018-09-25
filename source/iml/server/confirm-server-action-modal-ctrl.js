//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from "../socket/socket-stream.js";

export default function ConfirmServerActionModalCtrl($scope, $uibModalInstance, hosts, action) {
  "ngInject";
  $scope.confirmServerActionModal = {
    hosts,
    actionName: action.value,
    inProgress: false,
    go(skips) {
      this.inProgress = true;

      socketStream(
        "/command",
        {
          method: "post",
          json: {
            message: action.message,
            jobs: action.convertToJob(hosts)
          }
        },
        true
      )
        .map(xs => (skips ? null : xs))
        .stopOnError($scope.handleException)
        .each($uibModalInstance.close.bind($uibModalInstance));
    }
  };
}
