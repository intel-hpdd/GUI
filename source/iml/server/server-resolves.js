//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from "../store/get-store.js";
import broadcaster from "../broadcaster.js";

export default function serverResolves() {
  "ngInject";
  const locksStream = broadcaster(store.select("locks"));

  const alertMonitorStream = broadcaster(store.select("alertIndicators"));

  const lnetConfigurationStream = broadcaster(store.select("lnetConfiguration"));

  const serversStream = store.select("server");

  return Promise.all([locksStream, alertMonitorStream, lnetConfigurationStream, serversStream]).then(
    ([locksStream, alertMonitorStream, lnetConfigurationStream, serversStream]) => ({
      locksStream,
      alertMonitorStream,
      lnetConfigurationStream,
      serversStream
    })
  );
}
