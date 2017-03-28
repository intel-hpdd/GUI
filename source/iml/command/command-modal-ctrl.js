// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

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
