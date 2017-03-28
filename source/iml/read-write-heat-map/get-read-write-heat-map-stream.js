// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from '../socket/socket-stream.js';
import * as fp from 'intel-fp';

import type { HighlandStreamT } from 'highland';
import { flushOnChange } from '../chart-transformers/chart-transformers.js';

export default fp.curry4(
  (overrides, durationParams, rangeParams, timeOffset): HighlandStreamT<any> =>
    socketStream('/read-write-heat-map', {
      ...overrides,
      durationParams,
      rangeParams,
      timeOffset
    }).through(flushOnChange)
);
