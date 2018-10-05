// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const UPDATE_CPU_USAGE_CHART_ITEMS = "UPDATE_CPU_USAGE_CHART_ITEMS";
export const DEFAULT_CPU_USAGE_CHART_ITEMS = "DEFAULT_CPU_USAGE_CHART_ITEMS";

import produce from "immer";

import type { durationPayloadHashT } from "../duration-picker/duration-picker-module.js";

import type { addCpuUsageActionT } from "./cpu-usage-module.js";

export default (state: durationPayloadHashT = {}, { type, payload }: addCpuUsageActionT): durationPayloadHashT =>
  produce(state, (draft: durationPayloadHashT) => {
    switch (type) {
      case DEFAULT_CPU_USAGE_CHART_ITEMS:
        if (!state[payload.page]) draft[payload.page] = payload;
        break;
      case UPDATE_CPU_USAGE_CHART_ITEMS:
        Object.entries(payload).forEach(([key, val]) => {
          draft[payload.page][key] = val;
        });
        break;
    }
  });
