// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const HOST_AVAILABLE_ACTIONS = "HOST_AVAILABLE_ACTIONS";

import Immutable from "seamless-immutable";

import type { ActionT } from "../store/store-module.js";

export default function(state: Array<Object> = [], { type, payload }: ActionT): Array<Object> {
  switch (type) {
    case HOST_AVAILABLE_ACTIONS:
      return Immutable(payload);
    default:
      return state;
  }
}
