//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import getCopytoolStream from './get-copytool-stream.js';
import getCopytoolOperationStream from './get-copytool-operation-stream.js';

import {
  resolveStream
} from '../promise-transforms.js';

import {
  default as Maybe,
  withDefault
} from 'intel-maybe';

import {
  flow,
  map
} from 'intel-fp';

const fsParams = (filesystemId) => {
  return {
    qs: {
      filesystem_id: filesystemId
    }
  };
};

const routePath = flow(
  (x) => Maybe.of(x.fsId || null),
  map(fsParams),
  withDefault(() => ({}))
);

export function copytoolOperationStream ($stateParams) {
  'ngInject';

  return flow(
    routePath,
    getCopytoolOperationStream,
    resolveStream
  )($stateParams);
}

export function copytoolStream ($stateParams) {
  'ngInject';

  return flow(
    routePath,
    getCopytoolStream,
    resolveStream
  )($stateParams);
}

export function agentVsCopytoolChart ($stateParams, getAgentVsCopytoolChart) {
  'ngInject';

  return flow(
    routePath,
    getAgentVsCopytoolChart
  )($stateParams);
}
