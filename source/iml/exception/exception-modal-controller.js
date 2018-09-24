//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default function ExceptionModalCtrl($scope: $scopeT, $document) {
  "ngInject";

  $scope.exceptionModal = {
    reload: function reload() {
      $document[0].location.reload(true);
    }
  };
}
