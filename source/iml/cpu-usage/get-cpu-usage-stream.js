//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from '../socket/socket-stream.js';
import removeDups from '../charting/remove-dups.js';
import toNvd3 from '../charting/to-nvd3.js';
import highland from 'highland';

const types = ['user', 'system', 'iowait'];

export default (requestRange, buff) => {
  const s = highland((push, next) => {
    const params = requestRange({
      qs: {
        reduce_fn: 'average',
        metrics: 'cpu_total,cpu_user,cpu_system,cpu_iowait'
      }
    });

    socketStream('/host/metric', params, true)
      .flatten()
      .tap(function mapper(x) {
        types.forEach(function(type) {
          x.data[type] =
            (100 * x.data['cpu_' + type] + x.data.cpu_total / 2) /
            x.data.cpu_total /
            100;
        });
      })
      .map(function calculateCpuAndRam(x) {
        x.data.read = x.data.stats_read_bytes;
        x.data.write = -x.data.stats_write_bytes;

        return x;
      })
      .through(buff)
      .through(requestRange.setLatest)
      .through(removeDups)
      .through(toNvd3(types))
      .each(function pushData(x) {
        push(null, x);
        next();
      });
  });

  const s2 = s.ratelimit(1, 10000);

  s2.destroy = s.destroy.bind(s);

  return s2;
};
