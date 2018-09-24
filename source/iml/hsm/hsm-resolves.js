// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import getCopytoolStream from "./get-copytool-stream.js";
import getCopytoolOperationStream from "./get-copytool-operation-stream.js";

import { resolveStream } from "../promise-transforms.js";

import * as maybe from "@iml/maybe";

import type { Maybe } from "@iml/maybe";

const fsParams = filesystemId => {
  return {
    qs: {
      filesystem_id: filesystemId
    }
  };
};

const routePath = fp.flow(
  (x: Object): Maybe<string> => maybe.of(x.fsId || null),
  maybe.map.bind(null, fsParams),
  maybe.withDefault.bind(null, () => ({}))
);

export function copytoolOperationStream($stateParams: {}) {
  "ngInject";
  return fp.flow(
    routePath,
    getCopytoolOperationStream,
    resolveStream
  )($stateParams);
}

export function copytoolStream($stateParams: {}) {
  "ngInject";
  return fp.flow(
    routePath,
    getCopytoolStream,
    resolveStream
  )($stateParams);
}

export function agentVsCopytoolChart($stateParams: {}, getAgentVsCopytoolChart: Function) {
  "ngInject";
  return fp.flow(
    routePath,
    getAgentVsCopytoolChart
  )($stateParams);
}
