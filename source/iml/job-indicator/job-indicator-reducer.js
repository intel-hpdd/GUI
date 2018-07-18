// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { ADD_JOB_INDICATOR_ITEMS } from './job-indicator.js';

import type { ActionT } from '../store/store-module.js';

export default function(state: Array<Object> = [], { type, payload }: ActionT): Array<Object> {
  switch (type) {
    case ADD_JOB_INDICATOR_ITEMS:
      return payload;
    default:
      return state;
  }
}
