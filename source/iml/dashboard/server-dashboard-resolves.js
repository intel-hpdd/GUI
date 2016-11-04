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
