// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';
import COMMAND_STATES from './command-states.js';

const transformState = fp.over(fp.lensProp('state'));
const viewLens = fp.flow(fp.lensProp, fp.view);

export const setState = fp.cond(
  [viewLens('cancelled'), transformState(fp.always(COMMAND_STATES.CANCELLED))],
  [viewLens('errored'), transformState(fp.always(COMMAND_STATES.FAILED))],
  [viewLens('complete'), transformState(fp.always(COMMAND_STATES.SUCCEEDED))],
  [fp.always(true), transformState(fp.always(COMMAND_STATES.PENDING))]
);

export const trimLogs = fp.over(
  fp.lensProp('logs'),
  fp.invokeMethod('trim', [])
);

export const isFinished = fp.flow(
  setState,
  x => x.state,
  fp.eq(COMMAND_STATES.PENDING),
  fp.not
);
