// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from '../store/get-store.js';
import socketStream from '../socket/socket-stream.js';
import { noSpace } from '../string.js';

import { CACHE_INITIAL_DATA, ALLOW_ANONYMOUS_READ } from '../environment.js';

import { ADD_FS_ITEMS } from './file-system-reducer.js';

store.dispatch({
  type: ADD_FS_ITEMS,
  payload: CACHE_INITIAL_DATA.filesystem
});

if (ALLOW_ANONYMOUS_READ)
  socketStream('/filesystem', {
    qs: {
      jsonMask: noSpace`objects(
        id,
        resource_uri,
        label,
        locks,
        name,
        client_count,
        bytes_total,
        bytes_free,
        available_actions,
        mgt(
          primary_server_name,
          primary_server
        ),
        mdts(
          resource_uri
        )
      )`,
      limit: 0
    }
  })
    .map(x => x.objects)
    .each(payload =>
      store.dispatch({
        type: ADD_FS_ITEMS,
        payload
      }));
