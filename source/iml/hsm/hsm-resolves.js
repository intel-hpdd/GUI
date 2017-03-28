// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';
import getCopytoolStream from './get-copytool-stream.js';
import getCopytoolOperationStream from './get-copytool-operation-stream.js';

import { resolveStream } from '../promise-transforms.js';

import * as maybe from 'intel-maybe';

import type { Maybe } from 'intel-maybe';

const fsParams = filesystemId => {
  return {
    qs: {
      filesystem_id: filesystemId
    }
  };
};

const routePath = fp.flow(
  (x: Object): Maybe<string> => maybe.of(x.fsId || null),
  maybe.map(fsParams),
  maybe.withDefault(() => ({}))
);

export function copytoolOperationStream($stateParams: {}) {
  'ngInject';
  return fp.flow(routePath, getCopytoolOperationStream, resolveStream)(
    $stateParams
  );
}

export function copytoolStream($stateParams: {}) {
  'ngInject';
  return fp.flow(routePath, getCopytoolStream, resolveStream)($stateParams);
}

export function agentVsCopytoolChart(
  $stateParams: {},
  getAgentVsCopytoolChart: Function
) {
  'ngInject';
  return fp.flow(routePath, getAgentVsCopytoolChart)($stateParams);
}
