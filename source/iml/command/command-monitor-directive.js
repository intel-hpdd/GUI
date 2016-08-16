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
import socketStream from '../socket/socket-stream.js';
import getCommandStream from '../command/get-command-stream.js';

const set = fp.curry(3, (ctx, name, x) => ctx[name] = x);

const notCancelled = fp.filter(
  fp.flow(
    fp.view(
      fp.lensProp('cancelled')
    ),
    fp.not
  )
);

export function CommandMonitorCtrl ($scope, openCommandModal, localApply, $exceptionHandler) {
  'ngInject';

  var commandMonitorCtrl = this;

  commandMonitorCtrl.showPending = function showPending () {
    var stream = getCommandStream(commandMonitorCtrl.lastObjects);
    openCommandModal(stream)
      .result
      .finally(stream.destroy.bind(stream));
  };

  const commandMonitor$ = socketStream('/command', {
    qs: {
      limit: 0,
      errored: false,
      complete: false
    }
  });

  commandMonitor$
    .map(
      fp.flow(
        fp.view(fp.lensProp('objects')),
        notCancelled
      )
    )
    .tap(set(this, 'lastObjects'))
    .tap(fp.flow(
      fp.view(fp.lensProp('length')),
      set(this, 'length')
    ))
    .stopOnError((e) => $exceptionHandler(e))
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
