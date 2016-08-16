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
  ADD_ALERT_INDICATOR_ITEMS
} from './alert-indicator-reducer.js';

import {
  ALLOW_ANONYMOUS_READ
} from '../environment.js';

import type {
  HighlandStreamT
} from 'highland';

type bodyT = Array<{ affected:string[], message:string }>;
type resp$T = HighlandStreamT<{ objects:bodyT }>;

if (ALLOW_ANONYMOUS_READ) {
  const alert$:resp$T = socketStream('/alert/', {
    jsonMask: 'objects(affected,message)',
    qs: {
      limit: 0,
      active: true
    }
  });

  alert$
    .map(x => x.objects)
    .each(payload => store.dispatch({
      type: ADD_ALERT_INDICATOR_ITEMS,
      payload
    }));
}
