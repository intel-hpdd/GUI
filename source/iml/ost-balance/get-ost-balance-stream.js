// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';

import * as fp from 'intel-fp';
import * as obj from 'intel-obj';
import highland from 'highland';
import socketStream from '../socket/socket-stream.js';
import formatBytes from '../number-formatters/format-bytes.js';

import {
  flushOnChange
} from '../chart-transformers/chart-transformers.js';

import {
  times,
  gte
} from 'intel-math';

import type {
  HighlandStreamT
} from 'highland';

const viewLens = fp.flow(fp.lensProp, fp.view);
const mapMetrics = fp.flow(
  fp.map,
  obj.map
);
const filterMetrics = fp.flow(
  fp.filter,
  obj.map
);
const valuesLens = fp.lensProp('values');
const compareLocale = fp.flow(
  fp.invokeMethod('reverse', []),
  fp.over(fp.lensProp('0'), fp.arrayWrap),
  fp.invoke(fp.invokeMethod('localeCompare'))
);

const cmp = (...args) =>
  fp.flow(
    fp.map(viewLens('x')),
    fp.chainL((...args) => compareLocale(args))
  )(args);

const asPercentage = fp.flow(
  times(100),
  Math.round
);
const asFormattedBytes = fp.flow(
  times(1024),
  x => formatBytes(x, 4)
);

export default fp.curry2(function getOstBalanceStream (percentage:number, overrides:Object):HighlandStreamT<mixed> {
  const ltePercentage = fp.flow(
    fp.view(
      fp.compose(
        fp.lensProp('data'),
        fp.lensProp('detail'),
        fp.lensProp('percentUsed')
      )
    ),
    gte(percentage)
  );

  const s:HighlandStreamT<mixed> = highland(function generator (push, next) {
    var struct = [
      { key: 'Used bytes', values: [] },
      { key: 'Free bytes', values: [] }
    ];

    const toNvd3 = obj.reduceArr(() => struct, (metrics, key, arr) => {
      fp.map(function pushItems (item) {
        arr[0].values.push({
          x: key,
          y: item.data.used,
          detail: item.data.detail
        });
        arr[1].values.push({
          x: key,
          y: item.data.free,
          detail: item.data.detail
        });
      }, metrics);

      return arr;
    });

    var ostBalanceStream = socketStream('/target/metric', angular.merge({
      qs: {
        kind: 'OST',
        metrics: 'kbytestotal,kbytesfree',
        latest: true
      }
    }, overrides), true)
      .map(obj.pickBy(viewLens('length')))
      .map(mapMetrics(function (item) {
        item.data.free = item.data.kbytesfree / item.data.kbytestotal;
        item.data.used = 1 - item.data.free;

        item.data.detail = {
          percentFree: asPercentage(item.data.free),
          percentUsed: asPercentage(item.data.used),
          bytesFree: asFormattedBytes(item.data.kbytesfree),
          bytesUsed: asFormattedBytes(item.data.kbytestotal - item.data.kbytesfree),
          bytesTotal: asFormattedBytes(item.data.kbytestotal)
        };

        return item;
      }))
      .map(filterMetrics(ltePercentage));

    var targetStream = socketStream('/target', {
      qs: { limit: 0 },
      jsonMask: 'objects(id,name)'
    }, true)
      .pluck('objects');

    ostBalanceStream
      .zip(targetStream)
      .map(function convertKeys ([ostBalanceMetrics, targets]) {
        return obj.reduce(() => ({}), function reducer (val, key, result) {
          const findTarget = fp.find(fp.eqFn(fp.identity, viewLens('id'), key));

          const target = findTarget(targets);
          const name = (target ? target.name : key);

          result[name] = val;

          return result;
        }, ostBalanceMetrics);
      })
      .map(toNvd3)
      .map(fp.map(
        fp.over(
          valuesLens,
          xs => xs.sort(cmp)
        )
      ))
      .each((x) => {
        push(null, x);
        next();
      });
  });

  return s
    .ratelimit(1, 10000)
    .through(flushOnChange);
});
