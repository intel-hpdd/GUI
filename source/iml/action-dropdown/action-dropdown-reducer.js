// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const SET_ACTION_DROPDOWN_INACTIVE_ACTION = "SET_ACTION_DROPDOWN_INACTIVE_ACTION";

import Immutable from "seamless-immutable";

type ActionDropdownStateT = Object;

export type InActiveActionDropdownT = {|
  type: typeof SET_ACTION_DROPDOWN_INACTIVE_ACTION,
  payload: {||}
|};

export default function(
  state: ActionDropdownStateT = Immutable({}),
  { type, payload }: InActiveActionDropdownT
): ActionDropdownStateT {
  switch (type) {
    case SET_ACTION_DROPDOWN_INACTIVE_ACTION:
      return Immutable(payload);
    default:
      return state;
  }
}
