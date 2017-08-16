// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { ALLOW_ANONYMOUS_READ, CACHE_INITIAL_DATA } from './environment.js';

type CanDispatch = () => boolean;
export const canDispatch: CanDispatch = () =>
  ALLOW_ANONYMOUS_READ || CACHE_INITIAL_DATA.session.user != null;
