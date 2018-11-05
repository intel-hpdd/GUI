// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";

import type { HighlandStreamT } from "highland";
import { type TestHostT, type HostT } from "./server-module.js";

export function throwIfServerErrors(fn: Function) {
  return (objects: Object[]) => {
    const errors = objects.map(x => x.error).filter(Boolean);

    if (errors.length) throw new Error(JSON.stringify(errors));

    return fn(objects);
  };
}

export const getCommandAndHost = (s: HighlandStreamT<{ objects: Object[] }>) => {
  return s
    .map(x => x.objects)
    .map(throwIfServerErrors(fp.identity))
    .flatten()
    .map(x => x.command_and_host)
    .collect();
};

export const getTestHostState = (servers: HostT[], deployedServers: string[]) => (s: HighlandStreamT<*>) =>
  s.map(({ objects, valid }: { objects: TestHostT[], valid: boolean }) => {
    const updatedObjects = objects.map(server => {
      const matchingServer = servers.find(s => s.address === server.address);
      if (matchingServer != null)
        server = {
          ...server,
          state: matchingServer.state,
          deployed: deployedServers.find(x => x === server.address) != null
        };
      return server;
    });
    return { objects: updatedObjects, valid };
  });
