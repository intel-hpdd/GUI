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


import {map} from 'intel-fp';
import highland from 'highland';
import type {HighlandStream} from 'intel-flow-highland/include/highland.js';
import rebindDestroy from '../highland/rebind-destroy';

function combineReducers (reducers) {
  const keys = Object.keys(reducers);

  return function combination (state = {}, action) {
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

type streamFn = () => HighlandStream;
function broadcaster (s:HighlandStream):streamFn {
  var latest;

  const viewers = [];

  s.each(xs => {
    latest = xs;

    viewers.forEach(v => v.write(xs));
  });

  return () => {
    const s = highland();

    const oldDestroy = s.destroy.bind(s);

    s.destroy = () => {
      oldDestroy();
      viewers.splice(viewers.indexOf(s), 1);
    };

    if (latest)
      s.write(latest);

    viewers.push(s);

    return s;
  };
}

export type Store = {
  dispatch: Function;
  select: (key: string) => HighlandStream;
};

export default function createStore (reducers: Object): Store {
  const stream = highland();
  const combined = combineReducers(reducers);

  const view = broadcaster(
    stream
      .scan({}, combined)
      .filter(x => Object.keys(x).length > 0)
  );

  return {
    dispatch: stream.write.bind(stream),
    select (key: string): HighlandStream {
      return rebindDestroy(
        map(state => state[key]),
        view()
      );
    }
  };
}
