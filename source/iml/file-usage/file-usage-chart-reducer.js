// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const UPDATE_FILE_USAGE_CHART_ITEMS = "UPDATE_FILE_USAGE_CHART_ITEMS";
export const DEFAULT_FILE_USAGE_CHART_ITEMS = "DEFAULT_FILE_USAGE_CHART_ITEMS";

import Immutable from "seamless-immutable";

import type { durationPayloadHashT, durationPayloadT } from "../duration-picker/duration-picker-module.js";

import type { addFileUsageActionT } from "./file-usage-module.js";

function mergeState(state: durationPayloadHashT, payload: durationPayloadT) {
  return Immutable.merge(state, {
    [payload.page]: { ...state[payload.page], ...payload }
  });
}

export default function(
  state: durationPayloadHashT = Immutable({}),
  { type, payload }: addFileUsageActionT
): durationPayloadHashT {
  switch (type) {
    case DEFAULT_FILE_USAGE_CHART_ITEMS:
      if (!state[payload.page]) state = mergeState(state, payload);

      return state;
    case UPDATE_FILE_USAGE_CHART_ITEMS:
      return mergeState(state, payload);

    default:
      return state;
  }
}
