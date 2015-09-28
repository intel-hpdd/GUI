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

angular.module('readWriteHeatMap')
  .factory('getReadWriteHeatMapStream', ['λ', 'socketStream', 'chartPlugins',
    function getReadWriteHeatMapStreamFactory (λ, socketStream, chartPlugins) {
      'use strict';

      var headName = fp.flow(fp.head, fp.lensProp('name'));
      var compareLocale = fp.flow(
          fp.invokeMethod('reverse', []),
          fp.lensProp('0').map(fp.arrayWrap),
          fp.invoke(fp.invokeMethod('localeCompare'))
        );
      var cmp = fp.wrapArgs(
        fp.flow(
          fp.map(headName),
          fp.chainL(fp.wrapArgs(compareLocale))
        )
      );
      var sortOsts = fp.invokeMethod('sort', [cmp]);

      return function getReadWriteHeatMapStream (type, requestRange, buff) {
        var s = λ(function generator (push, next) {
          var params = requestRange({
            qs: {
              kind: 'OST',
              metrics: type
            }
          });

          socketStream('/target/metric', params, true)
            .through(chartPlugins.objToPoints)
            .through(buff)
            .through(chartPlugins.unionWithTarget)
            .through(requestRange.setLatest)
            .flatten()
            .through(chartPlugins.removeDupsBy(function cmp (a, b) {
              return a.id === b.id;
            }))
            .group('id')
            .map(_.values)
            .map(sortOsts)
            .each(function pushData (x) {
              push(null, x);
              next();
            });
        });

        return s.ratelimit(1, 10000);
      };
    }]);
