//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from "../store/get-store.js";
import broadcaster from "../broadcaster.js";

export default function serverResolves() {
  "ngInject";
  const locksStream = broadcaster(store.select("locks"));

  const alertMonitorStream = broadcaster(store.select("alertIndicators").map(Object.values));

  const lnetConfigurationStream = broadcaster(store.select("lnetConfiguration").map(Object.values));

  const serversStream = store.select("server").map(Object.values);

  return Promise.all([locksStream, alertMonitorStream, lnetConfigurationStream, serversStream]).then(
    ([locksStream, alertMonitorStream, lnetConfigurationStream, serversStream]) => ({
      locksStream,
      alertMonitorStream,
      lnetConfigurationStream,
      serversStream
    })
  );
}
