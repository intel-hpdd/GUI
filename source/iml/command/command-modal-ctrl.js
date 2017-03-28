// @flow

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

import * as fp from 'intel-fp';
import highland from 'highland';

import type { $scopeT } from 'angular';

import type { HighlandStreamT } from 'highland';

import type { commandT } from './command-types.js';

import { setState, trimLogs } from './command-transforms.js';

import commandModalTemplate from './assets/html/command-modal.html!text';

export function CommandModalCtrl(
  commandsStream: HighlandStreamT<commandT[]>,
  $scope: $scopeT,
  propagateChange: Function
) {
  'ngInject';
  this.accordion0 = true;

  const xForm = highland.map(fp.map(fp.flow(trimLogs, setState)));

  propagateChange($scope, this, 'commands', xForm(commandsStream));
}

export function openCommandModalFactory($uibModal: Object) {
  'ngInject';
  return function openCommandModal(stream: HighlandStreamT<commandT[]>) {
    return $uibModal.open({
      template: commandModalTemplate,
      controller: 'CommandModalCtrl',
      controllerAs: 'commandModal',
      windowClass: 'command-modal',
      backdrop: 'static',
      backdropClass: 'command-modal-backdrop',
      resolve: {
        commandsStream: fp.always(stream)
      }
    });
  };
}
