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

export default function ServerDetailController (
  $scope:Object, streams:Object,
  overrideActionClick:Function, propagateChange:Function
):void {
  'ngInject';

  const serverDetailController = this;

  Object.assign(this, {
    lnetConfigurationStream: streams.lnetConfigurationStream,
    jobMonitorStream: streams.jobMonitorStream,
    alertMonitorStream: streams.alertMonitorStream,
    corosyncConfigurationStream: streams.corosyncConfigurationStream,
    pacemakerConfigurationStream: streams.pacemakerConfigurationStream,
    networkInterfaceStream: streams.networkInterfaceStream,
    overrideActionClick
  });

  const p = propagateChange($scope, serverDetailController);

  streams.lnetConfigurationStream()
    .through(p('lnetConfiguration'));

  streams
    .serverStream
    .errors(function handle404 (err, push) {
      if (err.statusCode === 404) {
        push(null, null);
        return;
      }

      push(err);
    })
    .through(p('server'));

  $scope.$on('$destroy', function onDestroy () {
    Object.keys(streams)
      .forEach(function destroy (key) {
        streams[key].destroy ? streams[key].destroy() : streams[key].endBroadcast();
      });
  });
}
