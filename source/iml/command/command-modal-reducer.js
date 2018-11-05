// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const SHOW_COMMAND_MODAL_ACTION = "SHOW_COMMAND_MODAL_ACTION";

import Immutable from "seamless-immutable";

import type { Command } from "../command/command-types.js";

export type CommandModalT = {|
  type: typeof SHOW_COMMAND_MODAL_ACTION,
  payload: Command[]
|};

type stateT = Command[];

export default function(state: stateT = Immutable([]), { type, payload }: CommandModalT): stateT {
  switch (type) {
    case SHOW_COMMAND_MODAL_ACTION:
      return Immutable(payload);
    default:
      return state;
  }
}
