//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2014 Intel Corporation All Rights Reserved.
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


angular.module('command')
  .controller('CommandModalCtrl', ['commandsStream', '$scope',
    function CommandModalCtrl (commandsStream, $scope) {
      'use strict';

      this.accordion0 = true;

      commandsStream
        .tap(_.set('commands', this))
        .stopOnError($scope.handleException)
        .each($scope.localApply.bind(null, $scope));
    }])
  .factory('openCommandModal', ['$modal', function openCommandModalFactory ($modal) {
    'use strict';

    return function openCommandModal (stream) {
      return $modal.open({
        templateUrl: 'iml/command/assets/html/command-modal.html',
        controller: 'CommandModalCtrl',
        controllerAs: 'commandModal',
        windowClass: 'command-modal',
        backdrop: 'static',
        backdropClass: 'command-modal-backdrop',
        resolve: {
          commandsStream: _.fidentity(stream)
        }
      });
    };
  }]);
