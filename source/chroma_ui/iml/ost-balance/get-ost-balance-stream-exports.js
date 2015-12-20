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

import angular from 'angular';


export function getOstBalanceStreamFactory (λ, math, socketStream, formatBytes) {
  'ngInject';

  const mapMetrics = fp.flow(fp.map, obj.map);
  const filterMetrics = fp.flow(fp.filter, obj.map);
  const xLens = fp.lensProp('x');
  const valuesLens = fp.lensProp('values');
  const compareLocale = fp.flow(
    fp.invokeMethod('reverse', []),
    fp.lensProp('0').map(fp.arrayWrap),
    fp.invoke(fp.invokeMethod('localeCompare'))
  );
  const cmp = fp.wrapArgs(
    fp.flow(
      fp.map(xLens),
      fp.chainL(fp.wrapArgs(compareLocale))
    )
  );
  const sortOsts = fp.invokeMethod('sort', [cmp]);
  const asPercentage = fp.flow(math.times(100), Math.round);
  const asFormattedBytes = fp.flow(math.times(1024), fp.curry(2, formatBytes)(fp.__, 4));

  return fp.curry(2, function getOstBalanceStream (percentage, overrides) {
    const ltePercentage = fp.flow(
      fp.pathLens(['data', 'detail', 'percentUsed']), math.lte(percentage)
    );

    const s = λ(function generator (push, next) {
      var struct = [
        { key: 'Used bytes', values: [] },
        { key: 'Free bytes', values: [] }
      ];

      const toNvd3 = obj.reduce(struct, (metrics, key, arr) => {
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
        .map(obj.pickBy(fp.lensProp('length')))
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
          return obj.reduce({}, function reducer (val, key, result) {
            const findTarget = fp.find(fp.eqFn(fp.identity, fp.lensProp('id'), key));

            const target = findTarget(targets);
            const name = (target ? target.name : key);

            result[name] = val;
          }, ostBalanceMetrics);
        })
        .map(toNvd3)
        .map(fp.map(valuesLens.map(fp.wrapArgs(fp.invoke(sortOsts)))))
        .each(function pushData (x) {
          push(null, x);
          next();
        });
    });

    return s
      .ratelimit(1, 10000);
  });
}
