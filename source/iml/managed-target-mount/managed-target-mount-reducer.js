// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Immutable from "seamless-immutable";

export const ADD_MANAGED_TARGET_MOUNT_ITEMS = "ADD_MANAGED_TARGET_MOUNT_ITEMS";
export const DELETE_MANAGED_TARGET_MOUNT_ITEM = "DELETE_MANAGED_TARGET_MOUNT_ITEM";
export const UPDATE_MANAGED_TARGET_MOUNT_ITEM = "UPDATE_MANAGED_TARGET_MOUNT_ITEM";

export default function(state = Immutable({}), { type, payload }) {
  switch (type) {
    case ADD_MANAGED_TARGET_MOUNT_ITEMS:
      return Immutable(payload);
    case UPDATE_MANAGED_TARGET_MOUNT_ITEM:
      return state.set(payload.id, payload);
    case DELETE_MANAGED_TARGET_MOUNT_ITEM:
      return state.without(payload);
    default:
      return state;
  }
}
