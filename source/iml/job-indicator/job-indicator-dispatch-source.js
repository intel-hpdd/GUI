// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from '../store/get-store.js';

import { ADD_JOB_INDICATOR_ITEMS } from './job-indicator-module.js';

import { ALLOW_ANONYMOUS_READ } from '../environment.js';

import socketStream from '../socket/socket-stream.js';

if (ALLOW_ANONYMOUS_READ)
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
      }));
