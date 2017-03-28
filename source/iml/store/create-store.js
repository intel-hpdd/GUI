// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from 'highland';
import broadcast from '../broadcaster.js';

import type { HighlandStreamT } from 'highland';

import type { ActionT, StoreT } from './store-module.js';

type reducersT = { [key: string]: (prev: mixed, curr: ActionT) => mixed };
type combineT = { [key: string]: mixed };

function combineReducers(reducers: reducersT) {
  const keys = Object.keys(reducers);

  return function combination(state: combineT = {}, action: ActionT): combineT {
    const nextState = {};
    let changed = false;

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

export default function createStore(reducers: Object): StoreT {
  const stream = highland();
  const combined = combineReducers(reducers);

  type fnToStrMap$T = () => HighlandStreamT<{ [key: string]: mixed }>;

  const view: fnToStrMap$T = broadcast(
    stream.scan(combined, {}).filter(x => Object.keys(x).length > 0)
  );

  return {
    dispatch: stream.write.bind(stream),
    select(key: string): HighlandStreamT<mixed> {
      let lastItem;

      return view()
        .map(state => state[key])
        .filter(x => x !== lastItem)
        .tap(x => lastItem = x);
    }
  };
}
