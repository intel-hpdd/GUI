// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const SET_SESSION = "SET_SESSION";
export const SET_COOKIE = "SET_COOKIE";

import produce from "immer";

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

type stateT = {
  session?: sessionT,
  cookie?: string
};

export default (state: stateT = {}, { type, payload }: { type: string, payload: stateT }): stateT =>
  produce(state, (draft: stateT) => {
    switch (type) {
      case SET_SESSION:
        draft.session = payload.session;
        break;
      case SET_COOKIE:
        draft.cookie = payload.cookie;
        break;
    }
  });
