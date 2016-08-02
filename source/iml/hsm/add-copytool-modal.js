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

import socketStream from '../socket/socket-stream.js';

import {
  resolveStream
} from '../promise-transforms.js';

// $FlowIgnore: HTML templates that flow does not recognize.
import addCopytoolModalTemplate from './assets/html/add-copytool-modal';

export function AddCopytoolModalCtrl ($scope, $uibModalInstance, workerStream, fsStream) {
  'ngInject';

  var addCopytoolModalCtrl = this;

  angular.extend(addCopytoolModalCtrl, {
    inProgress: false,
    filesystems: [],
    workers: [],
    copytool: {},
    onSubmit (copytool) {
      addCopytoolModalCtrl.inProgress = true;

      socketStream('/copytool', {
        method: 'post',
        json: copytool
      }, true)
        .each($uibModalInstance.close.bind($uibModalInstance));
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

export function openAddCopytoolModalFactory ($uibModal) {
  'ngInject';

  return function openAddCopytoolModal () {
    return $uibModal.open({
      templateUrl: addCopytoolModalTemplate,
      controller: 'AddCopytoolModalCtrl as addCopytool',
      backdrop: 'static',
      windowClass: 'add-copytool-modal',
      resolve: {
        fsStream () {
          'ngInject';

          return resolveStream(socketStream('/filesystem', {
            jsonMask: 'objects(resource_uri,label)'
          }));
        },
        workerStream () {
          'ngInject';

          return resolveStream(socketStream('/host', {
            qs: { worker: true },
            jsonMask: 'objects(resource_uri,label)'
          }));
        }
      }
    }).result;
  };
}
