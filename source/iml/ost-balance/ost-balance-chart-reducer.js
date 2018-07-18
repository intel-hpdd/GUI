// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const UPDATE_OST_BALANCE_CHART_ITEMS = 'UPDATE_OST_BALANCE_CHART_ITEMS';
export const DEFAULT_OST_BALANCE_CHART_ITEMS = 'DEFAULT_OST_BALANCE_CHART_ITEMS';

import type { ostBalancePayloadT, ostBalancePayloadHashT, addOstBalanceActionT } from './ost-balance-module.js';

function mergeState(state: ostBalancePayloadHashT, payload: ostBalancePayloadT) {
  return Object.assign({}, state, {
    [payload.page]: { ...state[payload.page], ...payload }
  });
}

export default function(
  state: ostBalancePayloadHashT = {},
  { type, payload }: addOstBalanceActionT
): ostBalancePayloadHashT {
  switch (type) {
    case DEFAULT_OST_BALANCE_CHART_ITEMS:
      if (!state[payload.page]) state = mergeState(state, payload);

      return state;
    case UPDATE_OST_BALANCE_CHART_ITEMS:
      return mergeState(state, payload);

    default:
      return state;
  }
}
