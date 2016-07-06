// @flow

//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

export const UPDATE_MDO_CHART_ITEMS = 'UPDATE_MDO_CHART_ITEMS';
export const DEFAULT_MDO_CHART_ITEMS = 'DEFAULT_MDO_CHART_ITEMS';

import type {
  durationPayloadHashT,
  durationPayloadT
} from '../duration-picker/duration-picker-module.js';

import type {
  addMdoActionT
} from './mdo-module.js';

function mergeState (state:durationPayloadHashT, payload:durationPayloadT) {
  return Object.assign(
    {},
    state,
    {
      [payload.page]: {...state[payload.page], ...payload}
    }
  );
}

export default function (state:durationPayloadHashT = {},
  {type, payload}:addMdoActionT):durationPayloadHashT {

  switch (type) {
  case DEFAULT_MDO_CHART_ITEMS:
    if (!state[payload.page])
      state = mergeState(state, payload);

    return state;
  case UPDATE_MDO_CHART_ITEMS:
    return mergeState(state, payload);

  default:
    return state;
  }
}
