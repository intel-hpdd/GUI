// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { PropagateChange } from "../extend-scope-module.js";

import type { LockT } from "../locks/locks-reducer.js";

export default function ServerDetailController(
  $scope: Object,
  streams: Object,
  propagateChange: PropagateChange
): void {
  "ngInject";
  const serverDetailController = this;

  Object.assign(this, {
    lnetConfigurationStream: streams.lnetConfigurationStream,
    locksStream: streams.locksStream,
    alertMonitorStream: streams.alertMonitorStream,
    corosyncConfigurationStream: streams.corosyncConfigurationStream,
    pacemakerConfigurationStream: streams.pacemakerConfigurationStream,
    networkInterfaceStream: streams.networkInterfaceStream
  });

  const p = propagateChange.bind(null, $scope, serverDetailController);
  streams.lnetConfigurationStream().through(p.bind(null, "lnetConfiguration"));
  streams
    .locksStream()
    .map((xs: LockT) => ({ ...xs }))
    .through(p.bind(null, "locks"));

  streams.serverStream
    .errors(function handle404(err, push) {
      if (err.statusCode === 404) {
        push(null, null);
        return;
      }

      push(err);
    })
    .through(p.bind(null, "server"));

  $scope.$on("$destroy", function onDestroy() {
    Object.keys(streams).forEach(function destroy(key) {
      streams[key].destroy ? streams[key].destroy() : streams[key].endBroadcast();
    });
  });
}
