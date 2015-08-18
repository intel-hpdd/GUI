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

angular.module('mdo')
  .factory('getMdoStream', ['λ', 'socketStream', 'chartPlugins',
    function getMdoStreamFactory (λ, socketStream, chartPlugins) {
      'use strict';

      var statsPrefixRegex = /^stats_/;

      return function getMdoStream (requestRange, buff) {
        var stats = [
          'close',
          'getattr',
          'getxattr',
          'link',
          'mkdir',
          'mknod',
          'open',
          'rename',
          'rmdir',
          'setattr',
          'statfs',
          'unlink'
        ];

        var s = λ(function generator (push, next) {
          var prependStats = ''.concat.bind('stats_');
          var metrics = stats
            .map(_.unary(prependStats))
            .join(',');

          var params = requestRange({
            qs: {
              reduce_fn: 'sum',
              kind: 'MDT',
              metrics: metrics
            }
          });

          socketStream('/target/metric', params, true)
            .flatten()
            .map(stripStatsPrefix)
            .through(buff)
            .through(requestRange.setLatest)
            .through(chartPlugins.removeDups)
            .through(chartPlugins.toNvd3(stats))
            .each(function pushData (x) {
              push(null, x);
              next();
            });
        });

        return s.ratelimit(1, 10000);
      };

      function stripStatsPrefix (item) {
        item.data = _.transform(item.data, function stripper (result, value, key) {
          var newKey = key.trim().replace(statsPrefixRegex, '');
          result[newKey] = value;
          return result;
        });

        return item;
      }
    }]);
