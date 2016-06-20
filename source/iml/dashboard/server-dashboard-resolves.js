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

import resolveStream from '../resolve-stream.js';
import socketStream from '../socket/socket-stream.js';
import getCpuUsageChart from '../cpu-usage/get-cpu-usage-chart.js';

export function serverDashboardChartResolvesFactory ($route, $q, getReadWriteBandwidthChart,
                                                     getMemoryUsageChart) {
  'ngInject';

  return function serverDashboardChartResolves () {
    var serverId = $route.current.params.serverId;
    var serverQs = {
      qs: {
        id: serverId
      }
    };

    return $q.all([
      getReadWriteBandwidthChart({
        qs: {
          host_id: serverId
        }
      }),
      getCpuUsageChart(serverQs),
      getMemoryUsageChart(serverQs)
    ]);
  };
}

export function serverDashboardHostStreamResolvesFactory ($route) {
  'ngInject';

  return () => resolveStream(
    socketStream(
      '/host/' + $route.current.params.serverId,
      { jsonMask: 'label' }
    )
  );
}
