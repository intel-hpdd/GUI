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

import store from '../store/get-store.js';
import resolveStream from '../resolve-stream.js';
import socketStream from '../socket/socket-stream.js';
import rebindDestroy from '../highland/rebind-destroy.js';
import addProperty from '../highland/add-property.js';

import {
  map,
  find
} from 'intel-fp';

export function targetDashboardKindFactory ($route) {
  'ngInject';

  return function targetDashboardKind () {
    return $route.current.$$route.kind;
  };
}

export function targetDashboardResolvesFactory ($q, $route, getFileUsageChart, getSpaceUsageChart,
                                                getMdoChart, getReadWriteBandwidthChart) {
  'ngInject';

  return function targetDashboardResolves () {
    var targetId = $route.current.params.targetId;
    var kind = $route.current.$$route.kind;

    var qs = {
      qs: {
        id: targetId
      }
    };

    var title, key, chart;

    if (kind === 'MDT') {
      title = 'File Usage';
      key = 'Files Used';
      chart = getMdoChart;
    } else {
      chart = getReadWriteBandwidthChart;
      title = 'Object Usage';
      key = 'Objects Used';
    }

    return $q.all([
      chart(qs),
      getFileUsageChart(title, key, qs),
      getSpaceUsageChart(qs)
    ]);
  };
}

export function targetDashboardTargetStreamFactory ($route) {
  'ngInject';

  return () => rebindDestroy(
    map(find(x => x.id === $route.current.params.targetId)),
    store.select('targets'));
}

export function targetDashboardUsageStreamFactory ($route) {
  'ngInject';

  return function targetDashboardUsageStream () {
    return resolveStream(
      socketStream(
        `/target/${$route.current.params.targetId}/metric/`,
        {
          qs: {
            metrics: 'filestotal,filesfree,kbytestotal,kbytesfree',
            latest: true
          }
        }
      )
    )
      .then(function addThroughProperty (s) {
        var s2 = s
          .map(function convertToBytes (x) {
            var data = x[0].data;

            data.bytes_free = data.kbytesfree * 1024;
            data.bytes_total = data.kbytestotal * 1024;

            return data;
          });
        s2.destroy = s.destroy.bind(s);

        return addProperty(s2);
      });
  };
}
