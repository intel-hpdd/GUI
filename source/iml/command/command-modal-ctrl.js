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

// $FlowIgnore: HTML templates that flow does not recognize.
import commandModalTemplate from './assets/html/command-modal';

export function CommandModalCtrl (commandsStream, $scope, COMMAND_STATES) {
  'ngInject';

  this.accordion0 = true;

  const transformState = fp.over(fp.lensProp('state'));
  const viewLens = fp.flow(fp.lensProp, fp.view);

  var setState = fp.cond(
    [viewLens('cancelled'), transformState(fp.always(COMMAND_STATES.CANCELLED))],
    [viewLens('errored'), transformState(fp.always(COMMAND_STATES.FAILED))],
    [viewLens('complete'), transformState(fp.always(COMMAND_STATES.SUCCEEDED))],
    [fp.always(true), transformState(fp.always(COMMAND_STATES.PENDING))]
  );

  var xForm = fp.map(fp.map(fp.flow(
    fp.over(fp.lensProp('logs'), fp.invokeMethod('trim', [])),
    setState
  )));

  $scope.propagateChange(
    $scope,
    this,
    'commands',
    xForm(commandsStream)
  );
}

export function openCommandModalFactory ($uibModal) {
  'ngInject';

  return function openCommandModal (stream) {
    return $uibModal.open({
      templateUrl: commandModalTemplate,
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
