// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const UPDATE_READ_WRITE_BANDWIDTH_CHART_ITEMS = "UPDATE_READ_WRITE_BANDWIDTH_CHART_ITEMS";
export const DEFAULT_READ_WRITE_BANDWIDTH_CHART_ITEMS = "DEFAULT_READ_WRITE_BANDWIDTH_CHART_ITEMS";

import type { readWriteBandwidthActionT } from "./read-write-bandwidth-module.js";

import type { durationPayloadHashT, durationPayloadT } from "../duration-picker/duration-picker-module.js";

function mergeState(state: durationPayloadHashT, payload: durationPayloadT) {
  return Object.assign({}, state, {
    [payload.page]: { ...state[payload.page], ...payload }
  });
}

export default function(
  state: durationPayloadHashT = {},
  { type, payload }: readWriteBandwidthActionT
): durationPayloadHashT {
  switch (type) {
    case DEFAULT_READ_WRITE_BANDWIDTH_CHART_ITEMS:
      if (!state[payload.page]) state = mergeState(state, payload);

      return state;
    case UPDATE_READ_WRITE_BANDWIDTH_CHART_ITEMS:
      return mergeState(state, payload);

    default:
      return state;
  }
}
