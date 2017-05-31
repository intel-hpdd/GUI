//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

// @flow

import * as fp from 'intel-fp';
import bufferDataNewerThan from './buffer-data-newer-than.js';

import {
  flushOnChange
} from '../chart-transformers/chart-transformers.js';

import {
  getTimeParams
} from './get-time-params.js';

import type {
  streamWhenChartVisibleT
} from '../stream-when-visible/stream-when-visible-module.js';

export default (streamWhenVisible:streamWhenChartVisibleT) => {
  'ngInject';

  const { getRequestRange, getRequestDuration } = getTimeParams;

  const createStreamFn = fp.curry(6, function createStreamFn (durationFn:Function, buffFn:Function,
                                                           overrides:Object, streamFn:Function, begin:number,
                                                           end:number | string) {
    const getStreamArgs = fp.mapFn([
      durationFn(overrides),
      buffFn
    ]).bind(null, [begin, end]);

    const invokeStream = fp.invoke(streamFn);

    const buildChain = fp.flow(
      getStreamArgs,
      invokeStream
    );

    return flushOnChange(
      streamWhenVisible(
        buildChain
      )
    );
  });

  return {
    durationStream: createStreamFn(getRequestDuration, bufferDataNewerThan),
    rangeStream: createStreamFn(getRequestRange, fp.always(fp.identity))
  };
};
