//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';

import socketStream from '../socket/socket-stream.js';

import { resolveStream } from '../promise-transforms.js';

import addCopytoolModalTemplate
  from './assets/html/add-copytool-modal.html!text';

export function AddCopytoolModalCtrl(
  $scope,
  $uibModalInstance,
  workerStream,
  fsStream
) {
  'ngInject';
  const addCopytoolModalCtrl = this;

  angular.extend(addCopytoolModalCtrl, {
    inProgress: false,
    filesystems: [],
    workers: [],
    copytool: {},
    onSubmit(copytool) {
      addCopytoolModalCtrl.inProgress = true;

      socketStream(
        '/copytool',
        {
          method: 'post',
          json: copytool
        },
        true
      ).each($uibModalInstance.close.bind($uibModalInstance));
    }
  });

  let s = fsStream.pluck('objects');
  $scope.propagateChange($scope, addCopytoolModalCtrl, 'filesystems', s);

  s = workerStream.pluck('objects');
  $scope.propagateChange($scope, addCopytoolModalCtrl, 'workers', s);

  $scope.$on('$destroy', function onDestroy() {
    workerStream.destroy();
    fsStream.destroy();
  });
}

export function openAddCopytoolModalFactory($uibModal) {
  'ngInject';
  return function openAddCopytoolModal() {
    return $uibModal.open({
      template: addCopytoolModalTemplate,
      controller: 'AddCopytoolModalCtrl as addCopytool',
      backdrop: 'static',
      windowClass: 'add-copytool-modal',
      resolve: {
        fsStream() {
          'ngInject';
          return resolveStream(
            socketStream('/filesystem', {
              jsonMask: 'objects(resource_uri,label)'
            })
          );
        },
        workerStream() {
          'ngInject';
          return resolveStream(
            socketStream('/host', {
              qs: { worker: true },
              jsonMask: 'objects(resource_uri,label)'
            })
          );
        }
      }
    }).result;
  };
}
