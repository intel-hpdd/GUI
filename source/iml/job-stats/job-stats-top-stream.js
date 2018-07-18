// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from 'highland';
import * as obj from '@iml/obj';
import * as fp from '@iml/fp';
import socketStream from '../socket/socket-stream.js';
import bufferDataNewerThan from '../charting/buffer-data-newer-than.js';
import sumByDate from '../charting/sum-by-date.js';

import { normalize, calculateData, collectById } from './job-stats-transforms.js';

import { getRequestDuration, getRequestRange } from '../charting/get-time-params.js';

const getData$ = (builder, buffer) => (metric, arg1, arg2, overrides = {}) => {
  const d = builder(overrides)(arg1, arg2);
  const b = buffer(arg1, arg2);

  return () => {
    const params = d({
      qs: {
        job: 'id',
        metrics: metric
      }
    });

    return socketStream('/target/metric', params, true)
      .map(obj.values)
      .flatten()
      .through(b)
      .through(d.setLatest)
      .through(sumByDate)
      .through(normalize)
      .through(calculateData)
      .map(
        fp.map(x => ({
          id: x.id,
          [`${metric}_average`]: x.data.average,
          [`${metric}_min`]: x.data.min,
          [`${metric}_max`]: x.data.max
        }))
      );
  };
};

const getDuration$ = getData$(getRequestDuration, bufferDataNewerThan);

// eslint-disable-next-line no-unused-vars
const getRange$ = getData$(getRequestRange, (...rest) => x => x);

export const topDuration = (duration: number = 10, unit: string = 'minute', overrides: Object = {}) => {
  const streams = [
    getDuration$('read_bytes', duration, unit, overrides),
    getDuration$('write_bytes', duration, unit, overrides),
    getDuration$('read_iops', duration, unit, overrides),
    getDuration$('write_iops', duration, unit, overrides)
  ];

  return highland((push, next) => {
    highland(streams.map(s => s()))
      .through(collectById)
      .each(x => {
        push(null, x);
        next();
      });
  }).ratelimit(1, 10000);
};

export const topRange = (start: string, end: string, overrides: Object = {}) => {
  const streams = [
    getRange$('read_bytes', start, end, overrides),
    getRange$('write_bytes', start, end, overrides),
    getRange$('read_iops', start, end, overrides),
    getRange$('write_iops', start, end, overrides)
  ];

  return highland(streams.map(s => s())).through(collectById);
};
