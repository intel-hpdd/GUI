// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from 'highland';

import {
  documentHidden,
  documentVisible
} from '../stream-when-visible/stream-when-visible.js';

import * as fp from 'intel-fp';
import type {
  HighlandStreamT
} from 'highland';

import type {
  durationPayloadT
} from '../duration-picker/duration-picker-module.js';

import type {
  createStreamT
} from '../charting/charting-module.js';

import type {
  filesystemQueryT,
  targetQueryT
} from '../dashboard/dashboard-module.js';

import type {
  configToStreamT
} from './chart-transformers-module.js';

export const getConf = (page:string) =>
  highland.map(x => x[page]);

export function data$Fn (createStream:createStreamT) {
  'ngInject';

  return fp.curry3((overrides:filesystemQueryT | targetQueryT, chartStreamFn:configToStreamT,
    x:durationPayloadT):HighlandStreamT<mixed> => {

    let { durationStream, rangeStream } = createStream;
    durationStream = durationStream(overrides);
    rangeStream = rangeStream(overrides);

    switch (x.configType) {
    case 'duration':
      return durationStream(
        chartStreamFn(x),
        x.size,
        x.unit
      );
    default:
      return rangeStream(
        chartStreamFn(x),
        x.startDate,
        x.endDate
      );
    }
  });
}

export function flushOnChange (source$:HighlandStreamT<mixed>) {
  let called = false;

  const s2 = source$
    .consume((err, x, push, next) => {
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

export function waitForChartData (source$:HighlandStreamT<mixed>) {
  let passedDocumentHidden = false;
  let passedDocumentVisible = false;

  const s2 = source$
    .consume((err, x, push, next) => {
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
