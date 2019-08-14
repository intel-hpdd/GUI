// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { resolveStream, streamToPromise } from "../promise-transforms.js";
import getStore from "../store/get-store.js";
import { CACHE_INITIAL_DATA } from "../environment.js";

export function alertStream() {
  return resolveStream(
    getStore
      .select("alertIndicators")
      .map(Object.values)
      .map(xs => xs.filter(x => x.severity === "WARNING" || x.severity === "ERROR"))
  );
}

export function appNotificationStream() {
  return resolveStream(
    getStore
      .select("alertIndicators")
      .map(Object.values)
      .map(xs => xs.filter(x => x.severity === "WARNING" || x.severity === "ERROR"))
      .map(xs => {
        const serverities = new Set(xs.map(x => x.severity));

        let health = "GOOD";

        if (serverities.has("ERROR")) health = "ERROR";
        else health = "WARNING";

        return {
          health,
          count: xs.length
        };
      })
  );
}

export function appSessionFactory() {
  "ngInject";

  return CACHE_INITIAL_DATA.session;
}

export const sseResolves = () => streamToPromise(getStore.select("locks"));
