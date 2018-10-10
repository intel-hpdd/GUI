// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const SET_SESSION = "SET_SESSION";
export const SET_COOKIE = "SET_COOKIE";

import Immutable from "seamless-immutable";

import type { sessionT } from "../api-types.js";

import type { Exact } from "../../flow-workarounds.js";

export type sessionActionT = Exact<{
  type: typeof SET_SESSION,
  payload: { session: sessionT }
}>;
export type cookieActionT = Exact<{
  type: typeof SET_COOKIE,
  payload: { cookie: string }
}>;

export type sessionActionsT = sessionActionT | cookieActionT | Exact<{ type: string, payload: any }>;

type stateT = {
  session?: sessionT,
  cookie?: string
};

export default (state: stateT = {}, actions: sessionActionsT): stateT => {
  switch (actions.type) {
    case SET_SESSION:
    case SET_COOKIE:
      return Immutable.merge(state, actions.payload);

    default:
      return state;
  }
};
