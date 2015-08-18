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

angular
  .module('hsm')
  .factory('getAgentVsCopytoolStream',
    function getAgentVsCopytoolStreamFactory (λ, socketStream, chartPlugins, getTimeParams) {
      return function getAgentVsCopytoolStream (moreParams, size, unit) {
        var buff = chartPlugins.bufferDataNewerThan(size, unit);
        var requestDuration = getTimeParams
          .getRequestDuration(10, 'minutes');


        return λ(function generator (push, next) {
          var params = _.merge({
            qs: {
              role: 'MDT',
              metrics: 'hsm_actions_waiting,hsm_actions_running,hsm_agents_idle'
            }
          }, moreParams);

          params = requestDuration(params);

          socketStream('/target/metric', params, true)
            .map(_.values)
            .flatten()
            .through(chartPlugins.removeEpochData)
            .through(chartPlugins.roundData)
            .through(chartPlugins.sumByDate)
            .through(chartPlugins.nameSeries({
              hsm_actions_waiting: 'waiting requests',
              hsm_actions_running: 'running actions',
              hsm_agents_idle: 'idle workers'
            }))
            .through(chartPlugins.sortBy(function byDate (a, b) {
              return new Date(a.ts) - new Date(b.ts);
            }))
            .through(buff)
            .through(requestDuration.setLatest)
            .through(chartPlugins.removeDups)
            .collect()
            .each(function pushData (x) {
              push(null, x);
              next();
            });
        })
          .ratelimit(1, 10000);
    };
  });
