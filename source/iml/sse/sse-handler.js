// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import getSSEStream from "./sse-stream.js";
import getStore from "../store/get-store.js";

import { type LockT, UPDATE_LOCKS_ACTION } from "../locks/locks-reducer.js";

getSSEStream()
  .errors(e => console.log("e", e))
  .each((data: LockT) => {
    getStore.dispatch({
      type: UPDATE_LOCKS_ACTION,
      payload: data
    });
  });
