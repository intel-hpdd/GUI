// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from "../socket/socket-stream.js";

import { type TestHostT } from "./server-module.js";

const apiToHuman = (str: string): string => {
  const [first, ...rest] = str
    .split("_")
    .join(" ")
    .split("");

  return `${first.toUpperCase()}${rest.join("")}`;
};

const getTestHostStream = (objects: Object) => {
  const stream = socketStream("/test_host", {
    method: "post",
    json: objects
  });

  const s2 = stream
    .map((testHosts: TestHostT[]) => {
      return testHosts.map(testHost => {
        testHost.status = testHost.status.map(status => {
          status.uiName = apiToHuman(status.name);
          return status;
        });

        return testHost;
      });
    })
    .map(resp => {
      return {
        objects: resp,
        valid: resp.every(x => x.valid === true)
      };
    });

  s2.destroy = stream.destroy.bind(stream);
  return s2;
};

export default getTestHostStream;
