// @flow

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
import broadcaster from '../broadcaster.js';

import {
  find
} from 'intel-fp';

import type {
  chartT,
  chartTitleKeyT
} from './dashboard-types.js';

export function targetDashboardResolves (
  $stateParams:{ kind: string, targetId: string },
  getFileUsageChart:chartTitleKeyT,
  getSpaceUsageChart:chartT,
  getMdoChart:chartT,
  getReadWriteBandwidthChart:chartT
) {
  'ngInject';

  var targetId = $stateParams.targetId;
  const page = `target${targetId}`;
  var kind = $stateParams.kind;

  var qs = {
    qs: {
      id: targetId
    }
  };

  var title, key, chart;

  switch (kind) {
  case 'MDT':
    title = 'File Usage';
    key = 'Files Used';
    chart = getMdoChart(qs, page);
    break;
  default:
    chart = getReadWriteBandwidthChart(qs, page);
    title = 'Object Usage';
    key = 'Objects Used';
  }

  return Promise.all([
    chart,
    getFileUsageChart(title, key, qs, page),
    getSpaceUsageChart(qs, page)
  ]);
}

export function targetDashboardTargetStream ($stateParams:{targetId: string}) {
  'ngInject';

  return store
    .select('targets')
    .map(
      find(
        x => x.id === $stateParams.targetId
      )
    );
}

export function targetDashboardUsageStream ($stateParams:{targetId: string}) {
  'ngInject';

  return resolveStream(
    socketStream(
      `/target/${$stateParams.targetId}/metric/`,
      {
        qs: {
          metrics: 'filestotal,filesfree,kbytestotal,kbytesfree',
          latest: true
        }
      }
    )
    .map((x) => {
      const data = x[0].data;

      data.bytes_free = data.kbytesfree * 1024;
      data.bytes_total = data.kbytestotal * 1024;

      return data;
    })
  )
  .then(broadcaster);
}
