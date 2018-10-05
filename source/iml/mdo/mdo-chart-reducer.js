// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const UPDATE_MDO_CHART_ITEMS = "UPDATE_MDO_CHART_ITEMS";
export const DEFAULT_MDO_CHART_ITEMS = "DEFAULT_MDO_CHART_ITEMS";

import produce from "immer";
import { smartSpread } from "../immutability-utils";

import type { durationPayloadHashT } from "../duration-picker/duration-picker-module.js";

import type { addMdoActionT } from "./mdo-module.js";

export default (state: durationPayloadHashT = {}, { type, payload }: addMdoActionT): durationPayloadHashT =>
  produce(state, (draft: durationPayloadHashT) => {
    switch (type) {
      case DEFAULT_MDO_CHART_ITEMS:
        if (!state[payload.page]) draft[payload.page] = smartSpread(payload);
        break;
      case UPDATE_MDO_CHART_ITEMS:
        draft[payload.page] = smartSpread(draft[payload.page], payload);
        break;
    }
  });
