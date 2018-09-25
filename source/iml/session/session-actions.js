// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { SET_SESSION, SET_COOKIE } from "./session-reducer.js";

import type { sessionT } from "../api-types.js";

export const setCookie = (cookie: string) => ({
  type: SET_COOKIE,
  payload: {
    cookie
  }
});

export const setSession = (session: sessionT) => ({
  type: SET_SESSION,
  payload: {
    session
  }
});
