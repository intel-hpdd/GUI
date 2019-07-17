// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Immutable from "seamless-immutable";

export const ADD_STRATAGEM_ITEMS = "ADD_STRATAGEM_ITEMS";
export const DELETE_STRATAGEM_ITEM = "DELETE_STRATAGEM_ITEM";
export const UPDATE_STRATAGEM_ITEM = "UPDATE_STRATAGEM_ITEM";

export default function(state = Immutable({}), { type, payload }) {
  switch (type) {
    case ADD_STRATAGEM_ITEMS:
      return Immutable(payload);
    case UPDATE_STRATAGEM_ITEM:
      return state.set(payload.id, payload);
    case DELETE_STRATAGEM_ITEM:
      return state.without(payload);
    default:
      return state;
  }
}
