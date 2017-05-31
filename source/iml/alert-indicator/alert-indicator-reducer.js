// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.


export const ADD_ALERT_INDICATOR_ITEMS = 'ADD_ALERT_INDICATOR_ITEMS';

import type {
  ActionT
} from '../store/store-module.js';

export default function (state:Array<Object> = [], {type, payload}:ActionT):Array<Object> {
  switch (type) {
  case ADD_ALERT_INDICATOR_ITEMS:
    return payload;
  default:
    return state;
  }
}
