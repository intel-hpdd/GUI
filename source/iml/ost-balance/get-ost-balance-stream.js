// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from 'highland';
import socketStream from '../socket/socket-stream.js';

import { flushOnChange } from '../chart-transformers/chart-transformers.js';

import type { HighlandStreamT } from 'highland';

export default (percentage: number, overrides: Object = {}): HighlandStreamT<mixed> =>
  highland((push, next) => {
    socketStream('/ost-balance', { ...overrides, percentage }, true).each(x => {
      push(null, x);
      next();
    });
  })
    .ratelimit(1, 10000)
    .through(flushOnChange);
