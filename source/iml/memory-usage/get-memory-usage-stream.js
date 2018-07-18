//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from 'highland';
import socketStream from '../socket/socket-stream.js';
import removeDups from '../charting/remove-dups.js';
import toNvd3 from '../charting/to-nvd3.js';

const types = {
  'Total memory': function calc(x) {
    return x.mem_MemTotal * 1024;
  },
  'Used memory': function calc(x) {
    return x.mem_MemTotal * 1024 - x.mem_MemFree * 1024;
  },
  'Total swap': function calc(x) {
    return x.mem_SwapTotal * 1024;
  },
  'Used swap': function calc(x) {
    return x.mem_SwapTotal * 1024 - x.mem_SwapFree * 1024;
  }
};

export default function getMemoryUsageStream(requestRange, buff) {
  const s = highland((push, next) => {
    const params = requestRange({
      qs: {
        reduce_fn: 'average',
        metrics: 'mem_MemFree,mem_MemTotal,mem_SwapTotal,mem_SwapFree'
      }
    });

    socketStream('/host/metric', params, true)
      .flatten()
      .tap(x => {
        Object.keys(types).forEach(type => {
          x.data[type] = types[type](x.data);
        });
      })
      .through(buff)
      .through(requestRange.setLatest)
      .through(removeDups)
      .through(toNvd3(Object.keys(types)))
      .each(x => {
        push(null, x);
        next();
      });
  });

  const s2 = s.ratelimit(1, 10000);

  s2.destroy = s.destroy.bind(s);

  return s2;
}
