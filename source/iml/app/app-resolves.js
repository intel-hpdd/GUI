//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { resolveStream, streamToPromise } from "../promise-transforms.js";
import socketStream from "../socket/socket-stream.js";
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
  return resolveStream(socketStream("/health"));
}

export function appSessionFactory() {
  "ngInject";

  return CACHE_INITIAL_DATA.session;
}

export const sseResolves = () => streamToPromise(getStore.select("locks"));
