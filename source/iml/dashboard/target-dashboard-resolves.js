// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from "../store/get-store.js";
import socketStream from "../socket/socket-stream.js";
import broadcaster from "../broadcaster.js";
import { matchWith } from "@iml/maybe";
import { matchById } from "../api-transforms.js";

import { resolveStream } from "../promise-transforms.js";

import type { chartT, chartTitleKeyT } from "./dashboard-types.js";

export function targetDashboardResolves(
  $stateParams: { kind: string, id: string },
  getFileUsageChart: chartTitleKeyT,
  getSpaceUsageChart: chartT,
  getMdoChart: chartT,
  getReadWriteBandwidthChart: chartT
) {
  "ngInject";
  const id = $stateParams.id;
  const page = `target${id}`;
  const kind = $stateParams.kind;

  const qs = {
    qs: {
      id: id
    }
  };

  let title, key, chart;

  switch (kind) {
    case "MDT":
      title = "File Usage";
      key = "Files Used";
      chart = getMdoChart(qs, page);
      break;
    default:
      chart = getReadWriteBandwidthChart(qs, page);
      title = "Object Usage";
      key = "Objects Used";
  }

  return Promise.all([chart, getFileUsageChart(title, key, qs, page), getSpaceUsageChart(qs, page)]);
}

export function targetDashboardTargetStream($stateParams: { id: string }) {
  "ngInject";
  return store
    .select("targets")
    .map(matchById($stateParams.id))
    .map(
      matchWith.bind(null, {
        Just(x) {
          return x;
        },
        Nothing() {
          throw new Error(`Unable to find target ${$stateParams.id}`);
        }
      })
    );
}

export function targetDashboardUsageStream($stateParams: { id: string }) {
  "ngInject";
  return resolveStream(
    socketStream(`/target/${$stateParams.id}/metric/`, {
      qs: {
        metrics: "filestotal,filesfree,kbytestotal,kbytesfree",
        latest: true
      }
    }).map(x => {
      const data = x[0].data;

      data.bytes_free = data.kbytesfree * 1024;
      data.bytes_total = data.kbytestotal * 1024;

      return data;
    })
  ).then(broadcaster);
}
