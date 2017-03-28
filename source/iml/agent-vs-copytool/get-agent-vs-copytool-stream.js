//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from '../socket/socket-stream.js';
import removeEpochData from '../charting/remove-epoch-data.js';
import roundData from '../charting/round-data.js';
import sumByDate from '../charting/sum-by-date.js';
import nameSeries from '../charting/name-series.js';
import removeDups from '../charting/remove-dups.js';
import sortBy from '../charting/sort-by.js';
import highland from 'highland';

import { values } from 'intel-obj';

export default (requestRange, buff) => {
  return highland((push, next) => {
    const params = requestRange({
      qs: {
        role: 'MDT',
        metrics: 'hsm_actions_waiting,hsm_actions_running,hsm_agents_idle'
      }
    });

    socketStream('/target/metric', params, true)
      .map(values)
      .flatten()
      .through(removeEpochData)
      .through(roundData)
      .through(sumByDate)
      .map(x => ({
        ...x.data,
        ts: x.ts
      }))
      .through(
        nameSeries({
          hsm_actions_waiting: 'waiting requests',
          hsm_actions_running: 'running actions',
          hsm_agents_idle: 'idle workers'
        })
      )
      .through(
        sortBy(function byDate(a, b) {
          return new Date(a.ts) - new Date(b.ts);
        })
      )
      .through(buff)
      .through(requestRange.setLatest)
      .through(removeDups)
      .collect()
      .each(function pushData(x) {
        push(null, x);
        next();
      });
  }).ratelimit(1, 10000);
};
