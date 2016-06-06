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


import {
  ADD_TARGET_ITEMS
} from '../target/target-reducer.js';

import {
  ADD_ALERT_INDICATOR_ITEMS
} from '../alert-indicator/alert-indicator-reducer.js';

import {
  ADD_JOB_INDICATOR_ITEMS
} from '../job-indicator/job-indicator-reducer.js';

import {
  ADD_SERVER_ITEMS
} from '../server/server-reducer.js';

import {
  ADD_LNET_CONFIGURATION_ITEMS
} from '../lnet/lnet-configuration-reducer.js';

import {
  lensProp,
  view
} from 'intel-fp';

import type {
  StoreT
} from './store-module.js';

import type {
  SocketStreamT
} from '../socket/socket-module.js';

import type {
  HighlandStreamT
} from 'highland';

const pluckObjects = view(lensProp('objects'));

type createStore = (reducers: Object) => StoreT;

export default function (targetReducer:Function, createStore:createStore,
                         alertIndicatorReducer:Function, alertIndicatorStream:HighlandStreamT<mixed>,
                         jobIndicatorReducer:Function, jobIndicatorStream:HighlandStreamT<mixed>,
                         serverReducer:Function, serverStream:HighlandStreamT<mixed>,
                         lnetConfigurationReducer:Function, lnetConfigurationStream:HighlandStreamT<mixed>,
                         socketStream:SocketStreamT<mixed>, CACHE_INITIAL_DATA:Object):StoreT {
  'ngInject';

  const store = createStore({
    targets: targetReducer,
    alertIndicators: alertIndicatorReducer,
    jobIndicators: jobIndicatorReducer,
    server: serverReducer,
    lnetConfiguration: lnetConfigurationReducer
  });

  store.dispatch({ type: ADD_TARGET_ITEMS, payload: CACHE_INITIAL_DATA.target });
  store.dispatch({ type: ADD_SERVER_ITEMS, payload: CACHE_INITIAL_DATA.host});

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

  serverStream
  .each(payload => store.dispatch({ type: ADD_SERVER_ITEMS, payload}));

  lnetConfigurationStream
  .each(payload => store.dispatch({ type: ADD_LNET_CONFIGURATION_ITEMS, payload}));

  return store;
}
