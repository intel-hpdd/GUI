//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';

import socketStream from '../socket/socket-stream.js';

import {
  pick
} from 'intel-obj';

// $FlowIgnore: HTML templates that flow does not recognize.
import configureCorosyncTemplate from './assets/html/configure-corosync.html!text';

export function ConfigureCorosyncController ($scope, waitForCommandCompletion,
                                             propagateChange, insertHelpFilter) {
  'ngInject';

  const ctrl = this;

  angular.extend(ctrl, {
    observer: ctrl.stream(),
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
        .map(command => ([command]))
        .flatMap(waitForCommandCompletion(showModal))
        .map(() => false)
        .through(propagateChange($scope, ctrl, 'saving'));
    }
  });

  ctrl
    .stream()
    .through(propagateChange($scope, ctrl, 'config'));

  $scope.$on('$destroy', () => {
    ctrl.stream.endBroadcast();
    ctrl.alertStream.endBroadcast();
    ctrl.jobStream.endBroadcast();
  });
}

export const configureCorosyncComponent = {
  template: configureCorosyncTemplate,
  bindings: {
    stream: '<',
    alertStream: '<',
    jobStream: '<'
  },
  restrict: 'E',
  controller: 'ConfigureCorosyncController'
};
