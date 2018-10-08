// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const UPDATE_OST_BALANCE_CHART_ITEMS = "UPDATE_OST_BALANCE_CHART_ITEMS";
export const DEFAULT_OST_BALANCE_CHART_ITEMS = "DEFAULT_OST_BALANCE_CHART_ITEMS";

import produce from "immer";
import { smartSpread } from "../immutability-utils";

import type { ostBalancePayloadHashT, addOstBalanceActionT } from "./ost-balance-module.js";

export default (state: ostBalancePayloadHashT = {}, { type, payload }: addOstBalanceActionT): ostBalancePayloadHashT =>
  produce(state, (draft: ostBalancePayloadHashT) => {
    switch (type) {
      case DEFAULT_OST_BALANCE_CHART_ITEMS:
        if (!state[payload.page]) draft[payload.page] = smartSpread(payload);
        break;
      case UPDATE_OST_BALANCE_CHART_ITEMS:
        draft[payload.page] = smartSpread(draft[payload.page], payload);
        break;
    }
  });
