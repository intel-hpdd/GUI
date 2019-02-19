// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import global from "./global.js";
import getStore from "./store/get-store.js";

import { ACTION_DROPDOWN_SELECT_ACTION } from "./action-dropdown/action-dropdown-reducer.js";

global.addEventListener("action_selected", e => {
  getStore.dispatch({
    type: ACTION_DROPDOWN_SELECT_ACTION,
    payload: e.detail
  });
});
