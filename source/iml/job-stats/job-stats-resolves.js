// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from "../store/get-store.js";
import moment from "moment";
import * as maybe from "@iml/maybe";

import { matchById } from "../api-transforms.js";

import { streamToPromise, resolveStream } from "../promise-transforms.js";

import { topDuration, topRange } from "./job-stats-top-stream.js";

type jobStatsParamsT = {
  id: string,
  startDate: string,
  endDate: string
};

const fmt = str => moment(str).format("M/d/YY HH:mm:ss");

export function getData($stateParams: jobStatsParamsT) {
  "ngInject";
  if ($stateParams.id != null)
    return streamToPromise(
      store
        .select("targets")
        .map(Object.values)
        .map(matchById($stateParams.id))
        .map(
          maybe.map.bind(null, x => ({
            label: `${x.name} (${fmt($stateParams.startDate)} - ${fmt($stateParams.endDate)})`
          }))
        )
        .map(
          maybe.withDefault.bind(null, () => ({
            label: ""
          }))
        )
    );
  else return {};
}

export const jobstats$ = ($stateParams: jobStatsParamsT) => {
  "ngInject";
  if ($stateParams.id)
    return resolveStream(
      topRange($stateParams.startDate, $stateParams.endDate, {
        qs: {
          id: $stateParams.id
        }
      })
    );
  else return streamToPromise(store.select("jobStatsConfig")).then(c => resolveStream(topDuration(c.duration)));
};
