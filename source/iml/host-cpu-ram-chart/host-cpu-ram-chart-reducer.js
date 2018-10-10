// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const UPDATE_HOST_CPU_RAM_CHART_ITEMS = "UPDATE_HOST_CPU_RAM_CHART_ITEMS";
export const DEFAULT_HOST_CPU_RAM_CHART_ITEMS = "DEFAULT_HOST_CPU_RAM_CHART_ITEMS";

import Immutable from "seamless-immutable";

import type { addHostCpuRamActionT } from "./host-cpu-ram-chart-module.js";

import type { durationPayloadHashT, durationPayloadT } from "../duration-picker/duration-picker-module.js";

function mergeState(state: durationPayloadHashT, payload: durationPayloadT) {
  return Immutable.merge(state, {
    [payload.page]: { ...state[payload.page], ...payload }
  });
}

export default function(
  state: durationPayloadHashT = {},
  { type, payload }: addHostCpuRamActionT
): durationPayloadHashT {
  switch (type) {
    case DEFAULT_HOST_CPU_RAM_CHART_ITEMS:
      if (!state[payload.page]) state = mergeState(state, payload);

      return state;
    case UPDATE_HOST_CPU_RAM_CHART_ITEMS:
      return mergeState(state, payload);

    default:
      return state;
  }
}
