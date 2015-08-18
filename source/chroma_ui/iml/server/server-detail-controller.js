//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2014 Intel Corporation All Rights Reserved.
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

angular.module('server')
  .controller('ServerDetailController', ['$scope', '$exceptionHandler', 'streams',
    'overrideActionClick', 'localApply',
    function ServerDetailController ($scope, $exceptionHandler, streams,
                                     overrideActionClick, localApply) {
    'use strict';

    var serverDetailController = this;

    angular.extend(this, {
      lnetConfigurationStream: streams.lnetConfigurationStream,
      jobMonitorStream: streams.jobMonitorStream,
      alertMonitorStream: streams.alertMonitorStream,
      corosyncConfigurationStream: streams.corosyncConfigurationStream,
      networkInterfaceStream: streams.networkInterfaceStream,
      overrideActionClick: overrideActionClick,
      closeAlert: function closeAlert () {
        this.alertClosed = true;
      },
      getAlert: function getAlert () {
        return 'The information below describes the last state of %s before it was removed.'
          .sprintf(serverDetailController.server.address);
      }
    });

    streams.lnetConfigurationStream
      .property()
      .flatten()
      .tap(fp.lensProp('lnetConfiguration').set(fp.__, this))
      .stopOnError($exceptionHandler)
      .each(localApply.bind(null, $scope));


    streams.serverStream
      .tap(fp.lensProp('server').set(fp.__, this))
      .errors(function handle404 (err, push) {
        if (err.statusCode === 404) {
          serverDetailController.removed = true;
          return;
        }

        push(err);
      })
      .stopOnError($exceptionHandler)
      .each(localApply.bind(null, $scope));

    $scope.$on('$destroy', function onDestroy () {
      Object.keys(streams)
        .forEach(function destroy (key) {
          streams[key].destroy();
        });
    });
  }]);
