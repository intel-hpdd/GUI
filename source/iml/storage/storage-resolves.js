// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { HighlandStreamT } from 'highland';
import type { State } from './storage-reducer.js';

import store from '../store/get-store.js';
import { setStorageTableLoading } from './storage-actions.js';
import broadcaster from '../broadcaster.js';
import { resolveStream } from '../promise-transforms.js';
export const storageB = (): Promise<() => HighlandStreamT<mixed>> => {
  store.dispatch(setStorageTableLoading(true));
  return resolveStream(
    store.select('storage').filter((x: State) => x.config.selectIndex != null)
  ).then(broadcaster);
};

export const alertIndicatorB = () =>
  resolveStream(store.select('alertIndicators')).then(broadcaster);
