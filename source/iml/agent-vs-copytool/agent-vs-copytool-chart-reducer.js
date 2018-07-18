// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const UPDATE_AGENT_VS_COPYTOOL_CHART_ITEMS = 'UPDATE_AGENT_VS_COPYTOOL_CHART_ITEMS';
export const DEFAULT_AGENT_VS_COPYTOOL_CHART_ITEMS = 'DEFAULT_AGENT_VS_COPYTOOL_CHART_ITEMS';

import type { durationPayloadHashT, durationPayloadT } from '../duration-picker/duration-picker-module.js';

import type { addAgentVsCopytoolActionT } from './agent-vs-copytool-module.js';

function mergeState(state: durationPayloadHashT, payload: durationPayloadT) {
  return Object.assign({}, state, {
    [payload.page]: { ...state[payload.page], ...payload }
  });
}

export default function(
  state: durationPayloadHashT = {},
  { type, payload }: addAgentVsCopytoolActionT
): durationPayloadHashT {
  switch (type) {
    case DEFAULT_AGENT_VS_COPYTOOL_CHART_ITEMS:
      if (!state[payload.page]) state = mergeState(state, payload);

      return state;
    case UPDATE_AGENT_VS_COPYTOOL_CHART_ITEMS:
      return mergeState(state, payload);

    default:
      return state;
  }
}
