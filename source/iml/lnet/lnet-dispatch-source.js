// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from '../store/get-store.js';
import socketStream from '../socket/socket-stream.js';

import { ADD_LNET_CONFIGURATION_ITEMS } from './lnet-configuration-reducer.js';

import { ALLOW_ANONYMOUS_READ } from '../environment.js';

if (ALLOW_ANONYMOUS_READ)
  socketStream('/lnet_configuration', {
    qs: {
      dehydrate__host: false,
      limit: 0
    }
  })
    .map(x => x.objects)
    .each(payload =>
      store.dispatch({
        type: ADD_LNET_CONFIGURATION_ITEMS,
        payload
      })
    );
