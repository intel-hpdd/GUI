// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Immutable from "seamless-immutable";

export const ADD_LNET_CONFIGURATION_ITEMS = "ADD_LNET_CONFIGURATION_ITEMS";
export const UPDATE_LNET_CONFIGURATION_ITEM = "UPDATE_LNET_CONFIGURATION_ITEM";
export const DELETE_LNET_CONFIGURATION_ITEM = "DELETE_LNET_CONFIGURATION_ITEM";

export default function(state = Immutable({}), { type, payload }) {
  switch (type) {
    case ADD_LNET_CONFIGURATION_ITEMS:
      return Immutable(payload);
    case UPDATE_LNET_CONFIGURATION_ITEM:
      return state.set(payload.id, payload);
    case DELETE_LNET_CONFIGURATION_ITEM:
      return state.without(payload);
    default:
      return state;
  }
}
