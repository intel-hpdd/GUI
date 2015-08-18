//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2015 Intel Corporation All Rights Reserved.
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


angular.module('command')
  .controller('CommandMonitorCtrl',
    function CommandMonitorCtrl ($scope, commandMonitor, openCommandModal, getCommandStream) {
      var commandMonitorCtrl = this;

      commandMonitorCtrl.showPending = function showPending () {
        var stream = getCommandStream(commandMonitorCtrl.lastObjects);
        openCommandModal(stream)
          .result
          .finally(stream.destroy.bind(stream));
      };

      var lengthProp = fp.lensProp('length');

      commandMonitor
        .tap(fp.lensProp('lastObjects').set(fp.__, this))
        .tap(fp.flow(lengthProp, lengthProp.set(fp.__, this)))
        .stopOnError($scope.handleException)
        .each($scope.localApply.bind(null, $scope));

      $scope.$on('$destroy', commandMonitor.destroy.bind(commandMonitor));
    })
  .factory('commandMonitor', function commandMonitorFactory (socketStream) {
    var stream = socketStream('/command', {
      qs: {
        limit: 0,
        errored: false,
        complete: false
      }
    });

    var notCancelled = fp.filter(fp.flow(fp.lensProp('cancelled'), fp.not));

    var s2 = stream
      .map(fp.flow(fp.lensProp('objects'), notCancelled));

    s2.destroy = stream.destroy.bind(stream);

    return s2;
  });
