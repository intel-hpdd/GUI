// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from "../store/get-store.js";
import { ADD_TARGET_ITEMS } from "./target-reducer.js";
import { CACHE_INITIAL_DATA } from "../environment.js";

store.dispatch({
  type: ADD_TARGET_ITEMS,
  payload: CACHE_INITIAL_DATA.target.reduce((acc, x) => {
    acc[x.id] = x;

    return acc;
  }, {})
});
