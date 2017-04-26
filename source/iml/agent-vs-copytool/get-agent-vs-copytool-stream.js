//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import socketStream from '../socket/socket-stream.js';
import removeEpochData from '../charting/remove-epoch-data.js';
import roundData from '../charting/round-data.js';
import sumByDate from '../charting/sum-by-date.js';
import nameSeries from '../charting/name-series.js';
import removeDups from '../charting/remove-dups.js';
import sortBy from '../charting/sort-by.js';
import highland from 'highland';

export default (requestRange, buff) => {
  return highland((push, next) => {
    const params = requestRange({
      qs: {
        role: 'MDT',
        metrics: 'hsm_actions_waiting,hsm_actions_running,hsm_agents_idle'
      }
    });

    socketStream('/target/metric', params, true)
      .map(Object.values)
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
