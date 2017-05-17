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

export function waitUntilLoadedCtrl($scope) {
  'ngInject';
  $scope.wait = {
    close: function close() {
      $scope.$emit('addServerModal::closeModal');
    }
  };
}

export function waitUntilLoadedStep() {
  'ngInject';
  return {
    controller: 'WaitUntilLoadedCtrl',
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
