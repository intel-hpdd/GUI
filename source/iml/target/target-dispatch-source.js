// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from '../store/get-store.js';
import socketStream from '../socket/socket-stream.js';

import { ADD_TARGET_ITEMS } from './target-reducer.js';

import { CACHE_INITIAL_DATA, ALLOW_ANONYMOUS_READ } from '../environment.js';

store.dispatch({
  type: ADD_TARGET_ITEMS,
  payload: CACHE_INITIAL_DATA.target
});

if (ALLOW_ANONYMOUS_READ)
  socketStream('/target', {
    qs: {
      limit: 0
    }
  })
    .map(x => x.objects)
    .each(payload =>
      store.dispatch({
        type: ADD_TARGET_ITEMS,
        payload
      }));
