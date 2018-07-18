//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from '../socket/socket-stream.js';
import highland from 'highland';
import removeDups from '../charting/remove-dups.js';
import toNvd3 from '../charting/to-nvd3.js';

const statsPrefixRegex = /^stats_/;
const stripStatsPrefix = x => {
  const data = Object.entries(x.data).reduce((result, [key, value]) => {
    const newKey = key.trim().replace(statsPrefixRegex, '');
    result[newKey] = value;
    return result;
  }, {});

  return {
    ...x,
    data
  };
};

const stats = [
  'close',
  'getattr',
  'getxattr',
  'link',
  'mkdir',
  'mknod',
  'open',
  'rename',
  'rmdir',
  'setattr',
  'statfs',
  'unlink'
];

const prependStats = ''.concat.bind('stats_');
const metrics = stats.map(x => prependStats(x)).join(',');

export default (requestRange, buff) => {
  const s = highland((push, next) => {
    const params = requestRange({
      qs: {
        reduce_fn: 'sum',
        kind: 'MDT',
        metrics
      }
    });

    socketStream('/target/metric', params, true)
      .flatten()
      .map(stripStatsPrefix)
      .through(buff)
      .through(requestRange.setLatest)
      .through(removeDups)
      .through(toNvd3(stats))
      .each(x => {
        push(null, x);
        next();
      });
  });

  const s2 = s.ratelimit(1, 10000);

  s2.destroy = s.destroy.bind(s);

  return s2;
};
