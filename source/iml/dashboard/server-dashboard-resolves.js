// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { HighlandStreamT } from "highland";
import type { chartT } from "./dashboard-types.js";

import { matchWith } from "@iml/maybe";
import { matchById } from "../api-transforms.js";

export function serverDashboardChartResolves(
  $stateParams: { id: string },
  getReadWriteBandwidthChart: chartT,
  getMemoryUsageChart: chartT,
  getCpuUsageChart: chartT
) {
  "ngInject";
  const id = $stateParams.id;
  const page = `server${id}`;
  const serverQs = {
    qs: {
      id
    }
  };

  return Promise.all([
    getReadWriteBandwidthChart(
      {
        qs: {
          host_id: id
        }
      },
      page
    ),
    getCpuUsageChart(serverQs, page),
    getMemoryUsageChart(serverQs, page)
  ]);
}

export function serverDashboardHostStreamResolves(
  $stateParams: { id: string },
  hostsB: () => HighlandStreamT<Object[]>
) {
  "ngInject";
  return hostsB()
    .map(matchById($stateParams.id))
    .map(
      matchWith.bind(null, {
        Just(x) {
          return x;
        },
        Nothing() {
          throw new Error(`Unable to find server ${$stateParams.id}`);
        }
      })
    );
}
