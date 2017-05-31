// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from '../store/get-store.js';
import moment from 'moment';

import {
  matchById
} from '../api-transforms.js';

import {
  streamToPromise,
  resolveStream
} from '../promise-transforms.js';

import {
  topDuration,
  topRange
} from './job-stats-top-stream.js';

type jobStatsParamsT = {
  id:string,
  startDate:string,
  endDate:string
};

const fmt = str => moment(str)
    .format('M/d/YY HH:mm:ss');

export function getData ($stateParams:jobStatsParamsT) {
  'ngInject';

  if (!$stateParams.id)
    return {};
  else
    return streamToPromise(
      store
        .select('targets')
        .map(matchById($stateParams.id))
        .map(x => ({
          label: `${x.name} (${fmt($stateParams.startDate)} - ${fmt($stateParams.endDate)})`
        }))
    );
}

export const jobstats$ = ($stateParams:jobStatsParamsT) => {
  'ngInject';

  if ($stateParams.id)
    return resolveStream(
      topRange(
        $stateParams.startDate,
        $stateParams.endDate,
        {
          qs: {
            id: $stateParams.id
          }
        }
      )
    );
  else
    return streamToPromise(
      store
        .select('jobStatsConfig')
    )
      .then(c => resolveStream(
        topDuration(
          c.duration
        )
      ));
};
