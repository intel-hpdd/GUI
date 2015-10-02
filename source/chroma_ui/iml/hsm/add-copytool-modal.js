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


angular.module('hsm')
  .controller('AddCopytoolModalCtrl', ['$scope', '$modalInstance',
    'workerStream', 'socketStream', 'fsStream',
  function AddCopytoolModalCtrl ($scope, $modalInstance,
                                 workerStream, socketStream, fsStream) {
    'use strict';

    var addCopytoolModalCtrl = this;

    angular.extend(addCopytoolModalCtrl, {
      inProgress: false,
      filesystems: [],
      workers: [],
      copytool: {},
      onSubmit: function onSubmit (copytool) {
        addCopytoolModalCtrl.inProgress = true;

        socketStream('/copytool', {
          method: 'post',
          json: copytool
        }, true)
          .each($modalInstance.close.bind($modalInstance));
      }
    });

    var s = fsStream
      .pluck('objects');
    $scope.propagateChange($scope, addCopytoolModalCtrl, 'filesystems', s);

    s = workerStream
      .pluck('objects');
    $scope.propagateChange($scope, addCopytoolModalCtrl, 'workers', s);

    $scope.$on('$destroy', function onDestroy () {
      workerStream.destroy();
      fsStream.destroy();
    });
  }
])
.factory('openAddCopytoolModal', ['$modal', function openAddCopytoolModalFactory ($modal) {
  'use strict';

  return function openAddCopytoolModal () {
    return $modal.open({
      templateUrl: 'iml/hsm/assets/html/add-copytool-modal.html',
      controller: 'AddCopytoolModalCtrl as addCopytool',
      backdrop: 'static',
      windowClass: 'add-copytool-modal',
      resolve: {
        fsStream: ['resolveStream', 'socketStream', function getfsStream (resolveStream, socketStream) {
          return resolveStream(socketStream('/filesystem', {
            jsonMask: 'objects(resource_uri,label)'
          }));
        }],
        workerStream: ['resolveStream', 'socketStream', function getWorkerStream (resolveStream, socketStream) {
          return resolveStream(socketStream('/host', {
            qs: { worker: true },
            jsonMask: 'objects(resource_uri,label)'
          }));
        }]
      }
    }).result;
  };
}]);
