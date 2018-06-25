//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from '../socket/socket-stream.js';
import highland from 'highland';
import removeDups from '../charting/remove-dups.js';
import toNvd3 from '../charting/to-nvd3.js';

export default (requestRange, buff) => {
  const s = highland((push, next) => {
    const params = requestRange({
      qs: {
        metrics: 'kbytestotal,kbytesfree',
        reduce_fn: 'average'
      }
    });

    const key = 'Space Used';

    socketStream('/target/metric', params, true)
      .flatten()
      .tap(function calculateCpuAndRam(x) {
        x.data[key] = (x.data.kbytestotal - x.data.kbytesfree) / x.data.kbytestotal;
      })
      .through(buff)
      .through(requestRange.setLatest)
      .through(removeDups)
      .through(toNvd3([key]))
      .each(function pushData(x) {
        push(null, x);
        next();
      });
  });

  const s2 = s.ratelimit(1, 10000);

  s2.destroy = s.destroy.bind(s);

  return s2;
};
