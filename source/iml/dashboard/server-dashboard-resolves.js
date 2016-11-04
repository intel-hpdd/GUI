// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';

import type {
  HighlandStreamT
} from 'highland';

import type {
  chartT
} from './dashboard-types.js';

export function serverDashboardChartResolves (
  $stateParams:{ id:string },
  getReadWriteBandwidthChart:chartT,
  getMemoryUsageChart:chartT,
  getCpuUsageChart:chartT
) {
  'ngInject';

  const id = $stateParams.id;
  const page = `server${id}`;
  const serverQs = {
    qs: {
      id
    }
  };

  return Promise.all([
    getReadWriteBandwidthChart({
      qs: {
        host_id: id
      }
    }, page),
    getCpuUsageChart(serverQs, page),
    getMemoryUsageChart(serverQs, page)
  ]);
}

export function serverDashboardHostStreamResolves (
  $stateParams:{ id:string },
  hostsB:() => HighlandStreamT<Object[]>
) {
  'ngInject';

  return hostsB()
    .map(
      fp.filter(
        x => x.id === $stateParams.id
      )
    )
    .map(x => x[0]);
}
