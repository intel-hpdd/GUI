// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const SHOW_EXCEPTION_MODAL_ACTION = "SHOW_EXCEPTION_MODAL_ACTION";

import Immutable from "seamless-immutable";

export type ExceptionModalT = {|
  type: typeof SHOW_EXCEPTION_MODAL_ACTION,
  payload: Error
|};

type stateT = ?Error;

export default function(state: ?stateT = null, { type, payload }: ExceptionModalT): stateT {
  switch (type) {
    case SHOW_EXCEPTION_MODAL_ACTION:
      return Immutable(payload);
    default:
      return state;
  }
}
