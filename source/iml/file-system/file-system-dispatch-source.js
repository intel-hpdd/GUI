// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from '../store/get-store.js';
import socketStream from '../socket/socket-stream.js';
import { noSpace } from '../string.js';

import { CACHE_INITIAL_DATA } from '../environment.js';

import { canDispatch } from '../dispatch-source-utils.js';

import { ADD_FS_ITEMS } from './file-system-reducer.js';

store.dispatch({
  type: ADD_FS_ITEMS,
  payload: CACHE_INITIAL_DATA.filesystem
});

if (canDispatch())
  socketStream('/filesystem', {
    jsonMask: noSpace`objects(
        id,
        resource_uri,
        label,
        locks,
        name,
        client_count,
        bytes_total,
        bytes_free,
        files_total,
        files_free,
        available_actions,
        immutable_state,
        mgt(
          primary_server_name,
          primary_server
        ),
        mdts(
          resource_uri
        )
      )`,
    qs: {
      limit: 0
    }
  })
    .map(x => x.objects)
    .each(payload =>
      store.dispatch({
        type: ADD_FS_ITEMS,
        payload
      })
    );
