// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import COMMAND_STATES from "./command-states.js";

import type { Command } from "./command-types.js";

const transformState = v => (x: Command) => ({
  ...x,
  state: v
});

export const setState = fp.cond(
  [x => x.cancelled, transformState(COMMAND_STATES.CANCELLED)],
  [x => x.errored, transformState(COMMAND_STATES.FAILED)],
  [x => x.complete, transformState(COMMAND_STATES.SUCCEEDED)],
  [fp.True, transformState(COMMAND_STATES.PENDING)]
);

export const trimLogs = (x: Command) => ({
  ...x,
  logs: x.logs.trim()
});

export const isFinished = fp.flow(
  setState,
  x => x.state !== COMMAND_STATES.PENDING
);
