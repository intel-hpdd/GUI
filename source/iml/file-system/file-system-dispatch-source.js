// @flow

//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import store from '../store/get-store.js';
import socketStream from '../socket/socket-stream.js';
import {
  noSpace
} from '../string.js';

import {
  CACHE_INITIAL_DATA,
  ALLOW_ANONYMOUS_READ
} from '../environment.js';

import {
ADD_FS_ITEMS
} from './file-system-reducer.js';

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
  .each(payload => store.dispatch({
    type: ADD_FS_ITEMS,
    payload
  }));
