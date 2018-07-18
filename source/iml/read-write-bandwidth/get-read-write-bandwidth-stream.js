//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from 'highland';
import socketStream from '../socket/socket-stream.js';
import removeDups from '../charting/remove-dups.js';
import toNvd3 from '../charting/to-nvd3.js';

export default (requestRange, buff) => {
  const s = highland((push, next) => {
    const params = requestRange({
      qs: {
        reduce_fn: 'sum',
        kind: 'OST',
        metrics: 'stats_read_bytes,stats_write_bytes'
      }
    });

    socketStream('/target/metric', params, true)
      .flatten()
      .map(function calculateCpuAndRam(x) {
        x.data.read = x.data.stats_read_bytes;
        x.data.write = -x.data.stats_write_bytes;

        return x;
      })
      .through(buff)
      .through(requestRange.setLatest)
      .through(removeDups)
      .through(toNvd3(['read', 'write']))
      .each(function pushData(x) {
        push(null, x);
        next();
      });
  });

  const s2 = s.ratelimit(1, 10000);

  s2.destroy = s.destroy.bind(s);

  return s2;
};
