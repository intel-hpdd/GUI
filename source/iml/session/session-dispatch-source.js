// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from '../store/get-store.js';
import socketStream from '../socket/socket-stream.js';

import { setSession } from './session-actions.js';

import { CACHE_INITIAL_DATA } from '../environment.js';

store.dispatch(setSession(CACHE_INITIAL_DATA.session));

socketStream('/session', {}).each(x => store.dispatch(setSession(x)));
