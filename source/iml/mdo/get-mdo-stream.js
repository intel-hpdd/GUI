//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from '../socket/socket-stream.js';
import highland from 'highland';
import removeDups from '../charting/remove-dups.js';
import toNvd3 from '../charting/to-nvd3.js';

import {
  lensProp,
  over,
  map
} from 'intel-fp';

import {
  reduce
} from 'intel-obj';

const statsPrefixRegex = /^stats_/;
const dataLens = lensProp('data');
const stripStatsPrefix = over(dataLens, reduce(() => ({}), (value, key, result) => {
  var newKey = key.trim().replace(statsPrefixRegex, '');
  result[newKey] = value;
  return result;
}));

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
const metrics = map(prependStats, stats)
  .join(',');

export default (requestRange, buff) => {
  const s = highland((push, next) => {
    var params = requestRange({
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
      .each(function pushData (x) {
        push(null, x);
        next();
      });
  });

  const s2 = s.ratelimit(1, 10000);

  s2.destroy = s.destroy.bind(s);

  return s2;
};
