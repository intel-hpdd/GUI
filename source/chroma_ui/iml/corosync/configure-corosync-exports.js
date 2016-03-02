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
import {pick} from 'intel-obj/obj';

export function ConfigureCorosyncController ($scope, socketStream, waitForCommandCompletion,
                                             propagateChange, insertHelpFilter) {
  'ngInject';

  const ctrl = this;

  angular.extend(ctrl, {
    observer: ctrl.stream.observe(),
    getDiffMessage (state) {
      return insertHelpFilter(`${state.status}_diff`, state);
    },
    save (showModal) {
      ctrl.saving = true;

      socketStream(`/corosync_configuration/${ctrl.config.id}`, {
        method: 'put',
        json: pick(
          [
            'id',
            'mcast_port',
            'network_interfaces'
          ],
          ctrl.config
        )
      }, true)
        .map(command => {
          return { command };
        })
        .flatMap(waitForCommandCompletion(showModal))
        .map(() => false)
        .through(propagateChange($scope, ctrl, 'saving'));
    }
  });

  ctrl.stream
    .property()
    .through(propagateChange($scope, ctrl, 'config'));

  $scope.$on('$destroy', () => {
    ctrl.stream.destroy();
    ctrl.alertStream.destroy();
    ctrl.jobStream.destroy();
  });
}

export const configureCorosyncComponent = {
  templateUrl: 'iml/corosync/assets/html/configure-corosync.html',
  bindings: {
    stream: '<',
    alertStream: '<',
    jobStream: '<'
  },
  restrict: 'E',
  controller: 'ConfigureCorosyncController'
};
