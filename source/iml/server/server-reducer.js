// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Immutable from "seamless-immutable";

export const ADD_SERVER_ITEMS = "ADD_SERVER_ITEMS";
export const DELETE_SERVER_ITEM = "DELETE_SERVER_ITEM";
export const UPDATE_SERVER_ITEM = "UPDATE_SERVER_ITEM";

export default function(state = Immutable({}), { type, payload }) {
  switch (type) {
    case ADD_SERVER_ITEMS:
      return Immutable(payload);
    case UPDATE_SERVER_ITEM:
      return state.set(payload.id, payload);
    case DELETE_SERVER_ITEM:
      return state.without(payload);
    default:
      return state;
  }
}
