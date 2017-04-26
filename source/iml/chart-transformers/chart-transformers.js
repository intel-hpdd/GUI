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

import {
  documentHidden,
  documentVisible
} from '../stream-when-visible/stream-when-visible.js';

import type { HighlandStreamT } from 'highland';

import type {
  durationPayloadT
} from '../duration-picker/duration-picker-module.js';

import type { createStreamT } from '../charting/charting-module.js';

import type {
  filesystemQueryT,
  targetQueryT
} from '../dashboard/dashboard-module.js';

import type { configToStreamT } from './chart-transformers-module.js';

export const getConf = (page: string) => highland.map(x => x[page]);

export function data$Fn(createStream: createStreamT) {
  'ngInject';
  return (
    overrides: filesystemQueryT | targetQueryT,
    chartStreamFn: configToStreamT,
    x: durationPayloadT
  ): HighlandStreamT<mixed> => {
    let { durationStream, rangeStream } = createStream;
    durationStream = durationStream(overrides);
    rangeStream = rangeStream(overrides);

    switch (x.configType) {
      case 'duration':
        return durationStream(chartStreamFn(x), x.size, x.unit);
      default:
        return rangeStream(chartStreamFn(x), x.startDate, x.endDate);
    }
  };
}

export function flushOnChange(source$: HighlandStreamT<mixed>) {
  let called = false;

  const s2 = source$.consume((err, x, push, next) => {
    if (!called) {
      push(null, documentVisible);
      called = true;
    }

    if (err) {
      push(err);
      next();
    } else if (x === highland.nil) {
      push(err, x);
    } else {
      push(null, x);
      next();
    }
  });

  s2.write(documentHidden);

  return s2;
}

export function waitForChartData(source$: HighlandStreamT<mixed>) {
  let passedDocumentHidden = false;
  let passedDocumentVisible = false;

  const s2 = source$.consume((err, x, push, next) => {
    if (err) {
      push(err);
      next();
    } else if (x === highland.nil) {
      push(err, x);
    } else if (x === documentHidden && !passedDocumentHidden) {
      passedDocumentHidden = true;
      next();
    } else if (x === documentVisible && !passedDocumentVisible) {
      passedDocumentVisible = true;
      next();
    } else {
      push(null, x);
      next();
    }
  });

  return s2;
}
