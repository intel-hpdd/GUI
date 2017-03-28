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
import moment from 'moment';
import * as maybe from 'intel-maybe';

import { matchById } from '../api-transforms.js';

import { streamToPromise, resolveStream } from '../promise-transforms.js';

import { topDuration, topRange } from './job-stats-top-stream.js';

type jobStatsParamsT = {
  id: string,
  startDate: string,
  endDate: string
};

const fmt = str => moment(str).format('M/d/YY HH:mm:ss');

export function getData($stateParams: jobStatsParamsT) {
  'ngInject';
  if (!$stateParams.id)
    return {};
  else
    return streamToPromise(
      store
        .select('targets')
        .map(matchById($stateParams.id))
        .map(
          maybe.map(x => ({
            label: `${x.name} (${fmt($stateParams.startDate)} - ${fmt($stateParams.endDate)})`
          }))
        )
        .map(
          maybe.withDefault(() => ({
            label: ''
          }))
        )
    );
}

export const jobstats$ = ($stateParams: jobStatsParamsT) => {
  'ngInject';
  if ($stateParams.id)
    return resolveStream(
      topRange($stateParams.startDate, $stateParams.endDate, {
        qs: {
          id: $stateParams.id
        }
      })
    );
  else
    return streamToPromise(store.select('jobStatsConfig')).then(c =>
      resolveStream(topDuration(c.duration)));
};
