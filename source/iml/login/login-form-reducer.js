// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { Exact } from '../../flow-workarounds.js';

export const ADD_ERRORS = 'ADD_ERRORS';
export const ADD_IN_PROGRESS = 'ADD_IN_PROGRESS';

export type errorsActionT = Exact<{
  type: typeof ADD_ERRORS,
  payload: loginFormErrorsT
}>;
export type progressActionT = Exact<{
  type: typeof ADD_IN_PROGRESS,
  payload: loginFormInProgressT
}>;

export type loginFormActionsT = errorsActionT | progressActionT;

export type loginFormErrorsT = {
  __all__?: string,
  username?: string[],
  password?: string[]
};

export type loginFormInProgressT = Exact<{
  inProgress: boolean
}>;

export type loginFormT = Exact<{
  __all__?: string,
  username?: string[],
  password?: string[],
  inProgress: boolean
}>;

export default (state: loginFormT = { inProgress: false }, actions: loginFormActionsT): loginFormT => {
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
