// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from '../store/get-store.js';
import socketStream from '../socket/socket-stream.js';

import { ALLOW_ANONYMOUS_READ } from '../environment.js';

import { ADD_USER_ITEMS } from './user-reducer.js';

if (ALLOW_ANONYMOUS_READ)
  socketStream('/user', {
    qs: {
      limit: 0
    }
  })
    .map(x => x.objects)
    .each(payload =>
      store.dispatch({
        type: ADD_USER_ITEMS,
        payload
      }));
