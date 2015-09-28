//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2014 Intel Corporation All Rights Reserved.
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

angular.module('ostBalance')
  .factory('getOstBalanceStream', ['λ', 'socketStream', 'formatBytes',
    function getOstBalanceStream (λ, socketStream, formatBytes) {
      'use strict';

      var removeEmpty = λ.flip(_.pick, _.size);
      var mapValues = λ.flip(_.mapValues);
      var mapMetrics = _.compose(mapValues, _.fmap);
      var filterMetrics = _.compose(mapValues, _.ffilter);
      var xLens = fp.lensProp('x');
      var valuesLens = fp.lensProp('values');
      var compareLocale = fp.flow(
        fp.invokeMethod('reverse', []),
        fp.lensProp('0').map(fp.arrayWrap),
        fp.invoke(fp.invokeMethod('localeCompare'))
      );
      var cmp = fp.wrapArgs(
        fp.flow(
          fp.map(xLens),
          fp.chainL(fp.wrapArgs(compareLocale))
        )
      );
      var sortOsts = fp.invokeMethod('sort', [cmp]);

      return function getOstBalanceStream (percentage, overrides) {
        var ltePercentage = _.compose(_.lte(percentage), _.pluckPath('data.detail.percentUsed'));

        var s = λ(function generator (push, next) {
          var struct = [
            { key: 'Used bytes', values: [] },
            { key: 'Free bytes', values: [] }
          ];

          var toNvd3 = _.partialRight(_.reduce, function (arr, metrics, key) {
            mapValues(function pushItems (item) {
              arr[0].values.push({ x: key, y: item.data.used, detail: item.data.detail });
              arr[1].values.push({ x: key, y: item.data.free, detail: item.data.detail });
            }, metrics);
            return arr;
          }, struct);

          var ostBalanceStream = socketStream('/target/metric', _.merge({
            qs: {
              kind: 'OST',
              metrics: 'kbytestotal,kbytesfree',
              latest: true
            }
          }, overrides), true)
            .map(removeEmpty)
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
            .map(function convertKeys (streams) {
              return _.transform(streams[0], function (result, val, key) {
                var record = _.find(streams[1], { id: key });
                record = (record ? record.name : key);

                result[record] = val;
              });
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
      };

      function asPercentage (number) {
        return Math.round(number * 100);
      }

      function asFormattedBytes (number) {
        return formatBytes(number * 1024, 4);
      }
    }]);
