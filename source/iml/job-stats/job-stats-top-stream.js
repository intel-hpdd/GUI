// @flow

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

import highland from 'highland';
import * as obj from 'intel-obj';
import * as fp from 'intel-fp';
import socketStream from '../socket/socket-stream.js';
import bufferDataNewerThan from '../charting/buffer-data-newer-than.js';
import sumByDate from '../charting/sum-by-date.js';

import {
  normalize,
  calculateData,
  collectById
} from './job-stats-transforms.js';

import {
  getRequestDuration,
  getRequestRange
} from '../charting/get-time-params.js';


const getData$ = (builder, buffer) =>
  (metric, arg1, arg2, overrides={}) => {
    const d = builder(overrides, arg1, arg2);
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
        .map(fp.map(x => ({
          id: x.id,
          [`${metric}_average`]: x.data.average,
          [`${metric}_min`]: x.data.min,
          [`${metric}_max`]: x.data.max
        })));
    };
  };

const getDuration$ = getData$(
  getRequestDuration,
  bufferDataNewerThan
);

const getRange$ = getData$(
  getRequestRange,
  () => x => x
);

export const topDuration = (duration:number=10, unit:string='minute', overrides:Object={}) => {
  const streams = [
    getDuration$('read_bytes', duration, unit, overrides),
    getDuration$('write_bytes', duration, unit, overrides),
    getDuration$('read_iops', duration, unit, overrides),
    getDuration$('write_iops', duration, unit, overrides)
  ];

  return highland((push, next) => {
    highland(
      streams.map(
        s => s()
      )
    )
    .through(collectById)
    .each(x => {
      push(null, x);
      next();
    });
  })
    .ratelimit(1, 10000);
};


export const topRange = (start:string, end:string, overrides:Object={}) => {
  const streams = [
    getRange$('read_bytes', start, end, overrides),
    getRange$('write_bytes', start, end, overrides),
    getRange$('read_iops', start, end, overrides),
    getRange$('write_iops', start, end, overrides)
  ];

  return highland(
    streams.map(
      s => s()
    )
  )
  .through(collectById);
};
