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

import * as fp from 'intel-fp';
import socketStream from '../socket/socket-stream.js';

// $FlowIgnore: HTML templates that flow does not recognize.
import configureLnetTemplate from './assets/html/configure-lnet';

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
  templateUrl: configureLnetTemplate
};
