//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import extractApi from "@iml/extract-api";

import store from "../store/get-store.js";
import broadcaster from "../broadcaster.js";
import multiStream from "../multi-stream.js";

import { type FilesystemT } from "../file-system/file-system-reducer.js";
import { type TargetT } from "../target/target-reducer.js";

export default function serverResolves() {
  "ngInject";
  const locksStream = broadcaster(store.select("locks"));

  const alertMonitorStream = broadcaster(store.select("alertIndicators").map(Object.values));

  const lnetConfigurationStream = broadcaster(store.select("lnetConfiguration").map(Object.values));

  const serversStream = store.select("server").map(Object.values);

  const serversStream2 = store.select("server").map(Object.values);

  const targetsStream = store.select("targets").map(Object.values);

  const fsStream = store.select("fileSystems").map(Object.values);

  const getServers = (servers, filesystem: FilesystemT, targets: Array<TargetT>) =>
    targets
      .filter(
        t =>
          t.active_host != null &&
          (t.filesystem_id === filesystem.id ||
            (t.filesystems != null && t.filesystems.find(x => x.id === filesystem.id) != null))
      )
      .map(t => parseInt(extractApi(t.active_host), 10))
      .filter(x => !isNaN(x))
      .map(hostId => servers.find(h => h.id === hostId));

  const activeServersStream = multiStream([serversStream2, targetsStream, fsStream]).map(
    ([servers, targets, filesystems]) => {
      const activeServers = filesystems
        .filter(fs => fs.state === "available" || fs.state === "unavailable")
        .map(fs => getServers(servers, fs, targets))
        .map(xs => new Set(xs))
        .reduce((acc, curr) => {
          return new Set([...acc, ...curr]);
        }, new Set());

      return [...activeServers].filter(x => x != null).map(x => x.id);
    }
  );

  return Promise.all([
    locksStream,
    alertMonitorStream,
    lnetConfigurationStream,
    serversStream,
    activeServersStream
  ]).then(([locksStream, alertMonitorStream, lnetConfigurationStream, serversStream, activeServersStream]) => ({
    locksStream,
    alertMonitorStream,
    lnetConfigurationStream,
    serversStream,
    activeServersStream
  }));
}
