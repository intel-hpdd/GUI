// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from '../store/get-store.js';
import socketStream from '../socket/socket-stream.js';

import { ADD_ALERT_INDICATOR_ITEMS } from './alert-indicator-reducer.js';

import { ALLOW_ANONYMOUS_READ } from '../environment.js';

import type { HighlandStreamT } from 'highland';

type bodyT = Array<{ affected: string[], message: string }>;
type resp$T = HighlandStreamT<{ objects: bodyT }>;

if (ALLOW_ANONYMOUS_READ) {
  const alert$: resp$T = socketStream('/alert/', {
    jsonMask: 'objects(affected,message)',
    qs: {
      limit: 0,
      active: true
    }
  });

  alert$.map(x => x.objects).each(payload =>
    store.dispatch({
      type: ADD_ALERT_INDICATOR_ITEMS,
      payload
    })
  );
}
