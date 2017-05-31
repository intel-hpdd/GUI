//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from '../socket/socket-stream.js';
import highland from 'highland';
import removeDups from '../charting/remove-dups.js';
import toNvd3 from '../charting/to-nvd3.js';

export default (requestRange, buff) => {
  var s = highland((push, next) => {
    var params = requestRange({
      qs: {
        reduce_fn: 'average',
        metrics: 'cpu_total,cpu_user,cpu_system,cpu_iowait,mem_MemFree,mem_MemTotal'
      }
    });

    socketStream('/host/metric', params, true)
      .flatten()
      .map(function calculateCpuAndRam (x) {
        var cpuSum = x.data.cpu_user + x.data.cpu_system + x.data.cpu_iowait;
        x.data.cpu = (x.data.cpu_total ? (cpuSum / x.data.cpu_total) : 0.0);

        var usedMemory = x.data.mem_MemTotal - x.data.mem_MemFree;
        x.data.ram = usedMemory / x.data.mem_MemTotal;

        return x;
      })
      .through(buff)
      .through(requestRange.setLatest)
      .through(removeDups)
      .through(toNvd3(['cpu', 'ram']))
      .each(function pushData (x) {
        push(null, x);
        next();
      });
  });

  const s2 = s.ratelimit(1, 10000);

  s2.destroy = s.destroy.bind(s);

  return s2;
};
