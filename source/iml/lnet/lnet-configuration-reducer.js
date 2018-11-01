// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { ActionT } from "../store/store-module.js";

import Immutable from "seamless-immutable";

export const ADD_LNET_CONFIGURATION_ITEMS = "ADD_LNET_CONFIGURATION_ITEMS";

export default function(state: Array<Object> = Immutable([]), { type, payload }: ActionT): Array<Object> {
  switch (type) {
    case ADD_LNET_CONFIGURATION_ITEMS:
      return Immutable(payload);
    default:
      return state;
  }
}
