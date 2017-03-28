// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';
import socketStream from '../socket/socket-stream.js';
import getCommandStream from '../command/get-command-stream.js';

import type { $scopeT } from 'angular';

import type { localApplyT } from '../extend-scope-module.js';

const set = fp.curry3((ctx, name, x) => ctx[name] = x);

const notCancelled = fp.filter(
  fp.flow(fp.view(fp.lensProp('cancelled')), fp.not)
);

export function CommandMonitorCtrl(
  $scope: $scopeT,
  openCommandModal: Function,
  localApply: localApplyT,
  $exceptionHandler: Function
) {
  'ngInject';
  const commandMonitorCtrl = this;

  commandMonitorCtrl.showPending = function showPending() {
    const stream = getCommandStream(commandMonitorCtrl.lastObjects);
    openCommandModal(stream).result.finally(stream.destroy.bind(stream));
  };

  const commandMonitor$ = socketStream('/command', {
    qs: {
      limit: 0,
      errored: false,
      complete: false
    }
  });

  commandMonitor$
    .map(fp.flow(fp.view(fp.lensProp('objects')), notCancelled))
    .tap(set(this, 'lastObjects'))
    .tap(fp.flow(fp.view(fp.lensProp('length')), set(this, 'length')))
    .stopOnError(e => $exceptionHandler(e))
    .each(localApply.bind(null, $scope));

  this.length = 1;

  $scope.$on('$destroy', () => commandMonitor$.destroy());
}

export default () => ({
  restrict: 'A',
  controller: CommandMonitorCtrl,
  controllerAs: '$ctrl',
  template: `
    <a ng-if="$ctrl.length > 0" ng-click="$ctrl.showPending()">
      <i class="fa fa-refresh fa-spin command-in-progress"></i>
    </a>
  `
});
