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

export const SET_SESSION = 'SET_SESSION';
export const SET_COOKIE = 'SET_COOKIE';

import type { sessionT } from '../api-types.js';

import type { Exact } from '../../flow-workarounds.js';

export type sessionActionT = Exact<{
  type: typeof SET_SESSION,
  payload: { session: sessionT }
}>;
export type cookieActionT = Exact<{
  type: typeof SET_COOKIE,
  payload: { cookie: string }
}>;

export type sessionActionsT =
  | sessionActionT
  | cookieActionT
  | Exact<{ type: string, payload: any }>;

type stateT = {
  session?: sessionT,
  cookie?: string
};

export default (state: stateT = {}, actions: sessionActionsT): stateT => {
  switch (actions.type) {
    case SET_SESSION:
      return {
        ...state,
        ...actions.payload
      };
    case SET_COOKIE:
      return {
        ...state,
        ...actions.payload
      };
    default:
      return state;
  }
};
