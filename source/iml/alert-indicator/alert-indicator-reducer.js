// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const ADD_ALERT_INDICATOR_ITEMS = "ADD_ALERT_INDICATOR_ITEMS";
export const DELETE_ALERT_INDICATOR_ITEM = "DELETE_ALERT_INDICATOR_ITEM";
export const UPDATE_ALERT_INDICATOR_ITEM = "UPDATE_ALERT_INDICATOR_ITEM";

import Immutable from "seamless-immutable";

export default function(state = Immutable({}), { type, payload }) {
  switch (type) {
    case ADD_ALERT_INDICATOR_ITEMS:
      return Immutable(payload);
    case UPDATE_ALERT_INDICATOR_ITEM:
      return state.set(payload.id, payload);
    case DELETE_ALERT_INDICATOR_ITEM:
      return state.without(payload);
    default:
      return state;
  }
}
