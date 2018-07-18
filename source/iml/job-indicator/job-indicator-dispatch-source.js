// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from '../store/get-store.js';

import { ADD_JOB_INDICATOR_ITEMS } from './job-indicator.js';

import { canDispatch } from '../dispatch-source-utils.js';

import socketStream from '../socket/socket-stream.js';

if (canDispatch())
  socketStream('/job/', {
    jsonMask: 'objects(write_locks,read_locks,description)',
    qs: {
      limit: 0,
      state__in: ['pending', 'tasked']
    }
  })
    .map(x => x.objects)
    .each(payload =>
      store.dispatch({
        type: ADD_JOB_INDICATOR_ITEMS,
        payload
      })
    );
