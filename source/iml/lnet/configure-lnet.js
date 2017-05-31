//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';

import * as fp from 'intel-fp';
import socketStream from '../socket/socket-stream.js';

// $FlowIgnore: HTML templates that flow does not recognize.
import configureLnetTemplate from './assets/html/configure-lnet.html!text';

export function ConfigureLnetController ($scope, LNET_OPTIONS, insertHelpFilter,
                                         waitForCommandCompletion, propagateChange) {
  'ngInject';

  const ctrl = this;

  function getNetworkName (value) {
    return fp.find(x => x.value === value, LNET_OPTIONS).name;
  }

  const lndNetworkLens = fp.view(fp.compose(
    fp.lensProp('nid'),
    fp.lensProp('lnd_network')
  ));

  angular.extend(ctrl, {
    options: LNET_OPTIONS,
    save (showModal) {
      ctrl.saving = true;

      socketStream('/nid', {
        method: 'post',
        json: {
          objects: fp.pluck('nid', ctrl.networkInterfaces)
        }
      }, true)
        .map(x => [x.command])
        .flatMap(waitForCommandCompletion(showModal))
        .map(() => false)
        .through(propagateChange($scope, ctrl, 'saving'));
    },
    getLustreNetworkDriverTypeMessage (state) {
      return insertHelpFilter(`${state.status}_diff`, state);
    },
    getLustreNetworkDiffMessage (state) {
      return insertHelpFilter(`${state.status}_diff`, {
        local: getNetworkName(state.local),
        remote: getNetworkName(state.remote),
        initial: getNetworkName(state.initial)
      });
    },
    getOptionName (record) {
      return getNetworkName(lndNetworkLens(record));
    }
  });

  ctrl
    .networkInterfaceStream
    .through(propagateChange($scope, ctrl, 'networkInterfaces'));

  $scope.$on('$destroy',
    ctrl.networkInterfaceStream.destroy.bind(ctrl.networkInterfaceStream));
}

export const configureLnetComponent = {
  bindings: {
    networkInterfaceStream: '<',
    activeFsMember: '<'
  },
  controller: ConfigureLnetController,
  template: configureLnetTemplate
};
