// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from '../socket/socket-stream.js';

import type { HighlandStreamT } from 'highland';
import { flushOnChange } from '../chart-transformers/chart-transformers.js';

export default (
  overrides: Object,
  durationParams: ?Object,
  rangeParams: ?Object,
  timeOffset: number
): HighlandStreamT<*> =>
  socketStream('/read-write-heat-map', {
    ...overrides,
    durationParams,
    rangeParams,
    timeOffset
  }).through(flushOnChange);
