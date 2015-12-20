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

import angular from 'angular';


angular.module('server').controller('ConfirmServerActionModalCtrl',
  ['$scope', '$modalInstance', 'hosts', 'action', 'socketStream',
  function ConfirmServerActionModalCtrl ($scope, $modalInstance, hosts, action, socketStream) {
    'use strict';

    $scope.confirmServerActionModal = {
      hosts: hosts,
      actionName: action.value,
      inProgress: false,
      /**
       * Resolves the modal.
       * @param {Boolean} skips
       */
      go: function go (skips) {
        this.inProgress = true;

        socketStream('/command', {
          method: 'post',
          json: {
            message: action.message,
            jobs: action.convertToJob(hosts)
          }
        }, true)
          .pluck('objects')
          .map(_.if(_.fidentity(!skips), _.identity))
          .each(function onData (objects) {
            $modalInstance.close(objects);
          });
      }
    };
  }]);
