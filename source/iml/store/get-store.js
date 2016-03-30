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


import type {Store} from './create-store.js';
import type {SocketStream} from '../socket/socket-stream.js';
import type {HighlandStream} from 'intel-flow-highland/include/highland.js';
import {ADD_TARGET_ITEMS} from '../target/target-reducer.js';
import {ADD_ALERT_INDICATOR_ITEMS} from '../alert-indicator/alert-indicator-reducer.js';
import {ADD_JOB_INDICATOR_ITEMS} from '../job-indicator/job-indicator-reducer.js';

import {lensProp, view} from 'intel-fp';

const pluckObjects = view(lensProp('objects'));

type createStore = (reducers: Object) => Store;

export default function (targetReducer:Function, createStore:createStore,
                         alertIndicatorReducer:Function, alertIndicatorStream:HighlandStream,
                         jobIndicatorReducer:Function, jobIndicatorStream:HighlandStream,
                         socketStream:SocketStream, CACHE_INITIAL_DATA:Object):Store {
  'ngInject';

  const store = createStore({
    targets: targetReducer,
    alertIndicators: alertIndicatorReducer,
    jobIndicators: jobIndicatorReducer
  });

  store.dispatch({ type: ADD_TARGET_ITEMS, payload: CACHE_INITIAL_DATA.target });

  socketStream('/target', {
    qs: {
      limit: 0
    }
  })
  .map(pluckObjects)
  .each(payload => store.dispatch({ type: ADD_TARGET_ITEMS, payload }));

  alertIndicatorStream
  .each(payload => store.dispatch({ type: ADD_ALERT_INDICATOR_ITEMS, payload }));

  jobIndicatorStream
  .each(payload => store.dispatch({ type: ADD_JOB_INDICATOR_ITEMS, payload }));

  return store;
}
