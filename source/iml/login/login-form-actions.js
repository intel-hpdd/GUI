// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { ADD_ERRORS, ADD_IN_PROGRESS } from './login-form-reducer.js';

import type { loginFormErrorsT } from './login-form-reducer.js';

export const addErrors = (payload: loginFormErrorsT) => ({
  type: ADD_ERRORS,
  payload
});

export const addInProgress = (inProgress: boolean) => ({
  type: ADD_IN_PROGRESS,
  payload: {
    inProgress
  }
});
