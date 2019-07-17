// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from "../store/get-store.js";
import { CACHE_INITIAL_DATA } from "../environment.js";
import { ADD_SERVER_ITEMS } from "./server-reducer.js";

store.dispatch({
  type: ADD_SERVER_ITEMS,
  payload: CACHE_INITIAL_DATA.host.reduce((acc, x) => {
    acc[x.id] = x;

    return acc;
  }, {})
});
