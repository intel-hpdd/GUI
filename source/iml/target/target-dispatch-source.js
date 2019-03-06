// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from "../store/get-store.js";
import socketStream from "../socket/socket-stream.js";

import { ADD_TARGET_ITEMS } from "./target-reducer.js";

import { CACHE_INITIAL_DATA } from "../environment.js";

import { canDispatch } from "../dispatch-source-utils.js";

store.dispatch({
  type: ADD_TARGET_ITEMS,
  payload: CACHE_INITIAL_DATA.target
});

if (canDispatch())
  socketStream("/target", {
    qs: {
      limit: 0,
      dehydrate__volume: false
    }
  })
    .map(x => x.objects)
    .each(payload =>
      store.dispatch({
        type: ADD_TARGET_ITEMS,
        payload
      })
    );
