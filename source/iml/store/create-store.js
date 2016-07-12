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

import highland from 'highland';
import broadcast from '../broadcaster.js';

import type {
  HighlandStreamT
} from 'highland';


import type {
  ActionT,
  StoreT
} from './store-module.js';

type reducersT = { [key: string]: (prev:mixed, curr:ActionT) => mixed };
type combineT = { [key: string]: mixed };

function combineReducers (reducers:reducersT) {
  const keys = Object.keys(reducers);

  return function combination (state:combineT = {}, action:ActionT):combineT {
    var nextState = {};
    var changed = false;

    keys.forEach(k => {
      const reducer = reducers[k];
      const prevKeyState = state[k];
      const nextKeyState = reducer(prevKeyState, action);

      nextState[k] = nextKeyState;
      changed = changed || nextKeyState !== prevKeyState;
    });
    return changed ? nextState : state;
  };
}

export default function createStore (reducers:Object):StoreT {
  const stream = highland();
  const combined = combineReducers(reducers);

  const view = broadcast(
    stream
      .scan(combined, {})
      .filter(x => Object.keys(x).length > 0)
  );

  return {
    dispatch: stream.write.bind(stream),
    select (key:string):HighlandStreamT<mixed> {
      var lastItem;

      return view()
        .map(state => state[key])
        .filter(x => x !== lastItem)
        .tap(x => lastItem = x);
    }
  };
}
