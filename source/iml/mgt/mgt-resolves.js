// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';
import store from '../store/get-store.js';
import broadcast from '../broadcaster.js';

import type { HighlandStreamT } from 'highland';

type fnToStream = () => HighlandStreamT<mixed>;

export function mgtAlertIndicatorB(): fnToStream {
  return broadcast(store.select('alertIndicators'));
}

export function mgtJobIndicatorB(): fnToStream {
  return broadcast(store.select('jobIndicators'));
}

export function mgt$(): HighlandStreamT<mixed> {
  return store.select('targets').map(fp.filter(x => x.kind === 'MGT'));
}
