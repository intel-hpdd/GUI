// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const UPDATE_AGENT_VS_COPYTOOL_CHART_ITEMS = "UPDATE_AGENT_VS_COPYTOOL_CHART_ITEMS";
export const DEFAULT_AGENT_VS_COPYTOOL_CHART_ITEMS = "DEFAULT_AGENT_VS_COPYTOOL_CHART_ITEMS";

import produce from "immer";
import { smartSpread } from "../immutability-utils";

import type { durationPayloadHashT } from "../duration-picker/duration-picker-module.js";
import type { addAgentVsCopytoolActionT } from "./agent-vs-copytool-module.js";

export default (state: durationPayloadHashT = {}, { type, payload }: addAgentVsCopytoolActionT): durationPayloadHashT =>
  produce(state, (draft: durationPayloadHashT) => {
    switch (type) {
      case DEFAULT_AGENT_VS_COPYTOOL_CHART_ITEMS:
        if (!draft[payload.page]) draft[payload.page] = smartSpread(payload);
        break;
      case UPDATE_AGENT_VS_COPYTOOL_CHART_ITEMS:
        draft[payload.page] = smartSpread(draft[payload.page], payload);
        break;
    }
  });
