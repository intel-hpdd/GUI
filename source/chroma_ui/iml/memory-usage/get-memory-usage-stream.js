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

angular.module('memoryUsageModule')
  .factory('getMemoryUsageStream', ['λ', 'socketStream', 'chartPlugins',
    function getMemoryUsageStreamFactory (λ, socketStream, chartPlugins) {
      return function getMemoryUsageStream (requestRange, buff) {
        var s = λ(function generator (push, next) {
          var params = requestRange({
            qs: {
              reduce_fn: 'average',
              metrics: 'mem_MemFree,mem_MemTotal,mem_SwapTotal,mem_SwapFree'
            }
          });

          var types = {
            'Total memory': function calc (x) {
              return x.mem_MemTotal * 1024;
            },
            'Used memory': function calc (x) {
              return x.mem_MemTotal * 1024 - x.mem_MemFree * 1024;
            },
            'Total swap': function calc (x) {
              return x.mem_SwapTotal * 1024;
            },
            'Used swap': function calc (x) {
              return x.mem_SwapTotal * 1024 - x.mem_SwapFree * 1024;
            }
          };

          socketStream('/host/metric', params, true)
            .flatten()
            .tap(function calculateCpuAndRam (x) {
              Object.keys(types).forEach(function calculate (type) {
                x.data[type] = types[type](x.data);
              });
            })
            .through(buff)
            .through(requestRange.setLatest)
            .through(chartPlugins.removeDups)
            .through(chartPlugins.toNvd3(Object.keys(types)))
            .each(function pushData (x) {
              push(null, x);
              next();
            });
        });

        return s.ratelimit(1, 10000);
      };
    }]);
