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

import * as fp from '@mfl/fp';
import bufferDataNewerThan from './buffer-data-newer-than.js';

import { flushOnChange } from '../chart-transformers/chart-transformers.js';

import { getTimeParams } from './get-time-params.js';

import type {
  streamWhenChartVisibleT
} from '../stream-when-visible/stream-when-visible-module.js';

export default (streamWhenVisible: streamWhenChartVisibleT) => {
  'ngInject';
  const { getRequestRange, getRequestDuration } = getTimeParams;

  const createStreamFn = (durationFn: Function, buffFn: Function) => (
    overrides: Object
  ) => (streamFn: Function, begin: number, end: number | string) => {
    const d = durationFn(overrides);

    return flushOnChange(
      streamWhenVisible(() => streamFn(d(begin, end), buffFn(begin, end)))
    );
  };

  return {
    durationStream: createStreamFn(getRequestDuration, bufferDataNewerThan),
    rangeStream: createStreamFn(getRequestRange, fp.always(fp.identity))
  };
};
