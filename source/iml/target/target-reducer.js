// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const ADD_TARGET_ITEMS = 'ADD_TARGET_ITEMS';

import type { ActionT } from '../store/store-module.js';

export default function targetReducer(state: Array<Object> = [], { type, payload }: ActionT): Array<Object> {
  switch (type) {
    case ADD_TARGET_ITEMS:
      return payload;
    default:
      return state;
  }
}
