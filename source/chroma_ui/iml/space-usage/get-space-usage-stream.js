//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2015 Intel Corporation All Rights Reserved.
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

angular.module('spaceUsageModule')
  .factory('getSpaceUsageStream',
  function getSpaceUsageStreamFactory (λ, socketStream, chartPlugins) {
    return function getSpaceUsageStream (requestRange, buff) {
      var s = λ(function generator (push, next) {
        var params = requestRange({
          qs: {
            metrics: 'kbytestotal,kbytesfree',
            reduce_fn: 'average'
          }
        });

        var key = 'Space Used';

        socketStream('/target/metric', params, true)
          .flatten()
          .tap(function calculateCpuAndRam (x) {
            x.data[key] = (x.data.kbytestotal - x.data.kbytesfree) / x.data.kbytestotal;
          })
          .through(buff)
          .through(requestRange.setLatest)
          .through(chartPlugins.removeDups)
          .through(chartPlugins.toNvd3([key]))
          .each(function pushData (x) {
            push(null, x);
            next();
          });
      });

      return s.ratelimit(1, 10000);
    };
  });
