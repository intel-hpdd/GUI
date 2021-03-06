//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export function waitUntilLoadedCtrl($scope) {
  "ngInject";
  $scope.wait = {
    close: function close() {
      $scope.$emit("addServerModal::closeModal");
    }
  };
}

export function waitUntilLoadedStep() {
  "ngInject";
  return {
    controller: "WaitUntilLoadedCtrl",
    template: `<div class="modal-header">
  <button type="button" class="close" ng-click="wait.close()">
    <i class="fa fa-times"></i>
  </button>
  <h4 class="modal-title">{{'server_waiting_title' | insertHelp}}</h4>
  <i class="fa fa-question-circle"
     tooltip="{{'server_waiting' | insertHelp}}"
     tooltip-placement="bottom"></i>
</div>
<div class="loading-data">
  <div class="well text-center">
    <h2 class="text-center">{{'server_waiting_header' | insertHelp}}</h2>
    <p>{{'server_waiting' | insertHelp}}</p>
    <i class="fa fa-spinner fa-spin"></i>
  </div>
</div>`
  };
}
