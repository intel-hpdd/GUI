// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const ADD_FS_ITEMS = "ADD_FS_ITEMS";
export const DELETE_FILESYSTEM_ITEM = "DELETE_FILESYSTEM_ITEM";
export const UPDATE_FILESYSTEM_ITEM = "UPDATE_FILESYSTEM_ITEM";

import Immutable from "seamless-immutable";

export default function(state = Immutable({}), { type, payload }) {
  switch (type) {
    case ADD_FS_ITEMS:
      return Immutable(payload);
    case UPDATE_FILESYSTEM_ITEM:
      return state.set(payload.id, payload);
    case DELETE_FILESYSTEM_ITEM:
      return state.without(payload);
    default:
      return state;
  }
}
