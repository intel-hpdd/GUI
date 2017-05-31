// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default function ServerDetailController (
  $scope:Object, streams:Object,
  overrideActionClick:Function, propagateChange:Function
):void {
  'ngInject';

  var serverDetailController = this;

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
