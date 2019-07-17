// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Immutable from "seamless-immutable";

export const ADD_VOLUME_NODE_ITEMS = "ADD_VOLUME_NODE_ITEMS";
export const DELETE_VOLUME_NODE_ITEM = "DELETE_VOLUME_NODE_ITEM";
export const UPDATE_VOLUME_NODE_ITEM = "UPDATE_VOLUME_NODE_ITEM";

export default function(state = Immutable({}), { type, payload }) {
  switch (type) {
    case ADD_VOLUME_NODE_ITEMS:
      return Immutable(payload);
    case UPDATE_VOLUME_NODE_ITEM:
      return state.set(payload.id, payload);
    case DELETE_VOLUME_NODE_ITEM:
      return state.without(payload);
    default:
      return state;
  }
}
