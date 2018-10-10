// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const SET_DURATION = "SET_DURATION";
export const SET_SORT = "SET_SORT";

import Immutable from "seamless-immutable";

import type { ActionT } from "../store/store-module.js";

const startingState = Immutable({
  duration: 10,
  orderBy: "read_bytes_average",
  desc: true
});

export default function(state: Object = startingState, { type, payload }: ActionT): Object {
  switch (type) {
    case SET_DURATION:
    case SET_SORT:
      return Immutable.merge(state, payload);
    default:
      return state;
  }
}
