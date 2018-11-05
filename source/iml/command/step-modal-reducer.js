// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const SHOW_STEP_MODAL_ACTION = "SHOW_STEP_MODAL_ACTION";

import Immutable from "seamless-immutable";

import type { JobT } from "../command/command-types.js";

export type StepModalT = {|
  type: typeof SHOW_STEP_MODAL_ACTION,
  payload: JobT
|};

type stateT = JobT;

export default function(state: stateT = Immutable({}), { type, payload }: StepModalT): stateT {
  switch (type) {
    case SHOW_STEP_MODAL_ACTION:
      return Immutable(payload);
    default:
      return state;
  }
}
