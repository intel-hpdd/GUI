// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from "../store/get-store.js";
import { ADD_LNET_CONFIGURATION_ITEMS } from "./lnet-configuration-reducer.js";
import { CACHE_INITIAL_DATA } from "../environment.js";

store.dispatch({
  type: ADD_LNET_CONFIGURATION_ITEMS,
  payload: CACHE_INITIAL_DATA.lnet_configuration
});
