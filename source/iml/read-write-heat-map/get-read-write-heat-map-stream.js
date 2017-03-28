// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from '../socket/socket-stream.js';
import * as fp from 'intel-fp';
import highland from 'highland';
import unionWithTarget from '../charting/union-with-target.js';
import objToPoints from '../charting/obj-to-points.js';
import removeDupsBy from '../charting/remove-dups-by.js';

import { values } from 'intel-obj';

import type { HighlandStreamT } from 'highland';

const viewLens = fp.flow(fp.lensProp, fp.view);

const headName = fp.flow(fp.head, viewLens('name'));
const compareLocale = fp.flow(
  fp.invokeMethod('reverse', []),
  fp.over(fp.lensProp(0), fp.arrayWrap),
  fp.invoke(fp.invokeMethod('localeCompare'))
);
const cmp = (...args) =>
  fp.flow(fp.map(headName), fp.chainL((...args) => compareLocale(args)))(args);

const sortOsts = fp.invokeMethod('sort', [cmp]);

export default fp.curry3(
  (type: string, requestRange: Function, buff: Function): HighlandStreamT<any> => {
    return highland(function generator(push, next) {
      const params = requestRange({
        qs: {
          kind: 'OST',
          metrics: type
        }
      });

      const idLens = viewLens('id');

      socketStream('/target/metric', params, true)
        .through(objToPoints)
        .through(buff)
        .through(unionWithTarget)
        .through(requestRange.setLatest)
        .flatten()
        .through(removeDupsBy(fp.eqFn(idLens, idLens)))
        .group('id')
        .map(values)
        .map(sortOsts)
        .each(function pushData(x) {
          push(null, x);
          next();
        });
    }).ratelimit(1, 10000);
  }
);
