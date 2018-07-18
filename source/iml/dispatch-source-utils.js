// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { ALLOW_ANONYMOUS_READ, CACHE_INITIAL_DATA } from './environment.js';

export const canDispatch = () => ALLOW_ANONYMOUS_READ || CACHE_INITIAL_DATA.session.user != null;
