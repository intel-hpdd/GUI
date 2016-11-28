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

import type {
  Exact
} from '../../flow-workarounds.js';

export const ADD_ERRORS = 'ADD_ERRORS';
export const ADD_IN_PROGRESS = 'ADD_IN_PROGRESS';

export type errorsActionT = Exact<{
  type:typeof ADD_ERRORS,
  payload:loginFormErrorsT
}>;
export type progressActionT = Exact<{
  type:typeof ADD_IN_PROGRESS,
  payload:loginFormInProgressT
}>;

export type loginFormActionsT =
  | errorsActionT
  | progressActionT;

export type loginFormErrorsT = {
  __all__?:string,
  username?:string[],
  password?:string[],
};

export type loginFormInProgressT = Exact<{
  inProgress:boolean
}>;

export type loginFormT = Exact<{
  __all__?:string,
  username?:string[],
  password?:string[],
  inProgress:boolean
}>;

export default (
  state:loginFormT = {inProgress:false},
  actions:loginFormActionsT
):loginFormT => {
  switch (actions.type) {
  case ADD_ERRORS:
    return {
      ...actions.payload
    };
  case ADD_IN_PROGRESS:
    return {
      inProgress: actions.payload.inProgress
    };
  default:
    return state;
  }
};
