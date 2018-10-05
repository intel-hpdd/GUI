// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const ADD_ALERT_INDICATOR_ITEMS = "ADD_ALERT_INDICATOR_ITEMS";

import { immutableOriginal } from "../immutability-utils.js";

import type { ActionT } from "../store/store-module.js";

export default function(state: Object[] = [], { type, payload }: ActionT): Object[] {
  switch (type) {
    case ADD_ALERT_INDICATOR_ITEMS:
      return payload.map(immutableOriginal);
    default:
      return state;
  }
}
