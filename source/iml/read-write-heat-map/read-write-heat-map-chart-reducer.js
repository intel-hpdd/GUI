// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const UPDATE_READ_WRITE_HEAT_MAP_CHART_ITEMS = "UPDATE_READ_WRITE_HEAT_MAP_CHART_ITEMS";
export const DEFAULT_READ_WRITE_HEAT_MAP_CHART_ITEMS = "DEFAULT_READ_WRITE_HEAT_MAP_CHART_ITEMS";

import produce from "immer";
import { smartSpread } from "../immutability-utils";

import type { heatMapPayloadHashT, addReadWriteHeatMapActionT } from "./read-write-heat-map-module.js";

export default (state: heatMapPayloadHashT = {}, { type, payload }: addReadWriteHeatMapActionT): heatMapPayloadHashT =>
  produce(state, (draft: heatMapPayloadHashT) => {
    switch (type) {
      case DEFAULT_READ_WRITE_HEAT_MAP_CHART_ITEMS:
        if (!state[payload.page]) draft[payload.page] = smartSpread(payload);
        break;
      case UPDATE_READ_WRITE_HEAT_MAP_CHART_ITEMS:
        draft[payload.page] = smartSpread(draft[payload.page], payload);
        break;
    }
  });
