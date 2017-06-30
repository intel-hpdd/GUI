// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import * as fp from '@iml/fp';
import * as maybe from '@iml/maybe';

import getServerMoment from '../get-server-moment.js';
import createDate from '../create-date.js';

import type { HighlandStreamT } from 'highland';

type Point = {
  data: {
    [key: string]: number
  },
  ts: string
};

export const getRequestRange = (overrides: Object) => (
  begin: number | string,
  end: string
) => {
  getRequestRange.setLatest = fp.identity;

  return getRequestRange;

  function getRequestRange(params: Object) {
    params = angular.merge({}, params, overrides);
    params.qs.begin = getServerMoment(begin).toISOString();
    params.qs.end = getServerMoment(end).toISOString();

    return params;
  }
};

export const getRequestDuration = (overrides: Object) => (
  size: number | string,
  unit: string
) => {
  let latest;

  getRequestDuration.setLatest = (s: HighlandStreamT<Point>) => {
    return s
      .collect()
      .tap(xs => {
        const last = maybe.map(x => x.ts, fp.last(xs));
        latest = maybe.withDefault(() => null, last);
      })
      .flatten();
  };

  return getRequestDuration;

  function getRequestDuration(params: Object) {
    params = angular.merge({}, params, overrides);

    if (latest) {
      const latestDate = createDate(latest);

      params.qs.end = latestDate.toISOString();
      params.qs.begin = createDate().toISOString();
      params.qs.update = true;
    } else {
      const end = getServerMoment().milliseconds(0);

      const secs = end.seconds();
      end.seconds(secs - secs % 10);

      params.qs.end = end.clone().add(10, 'seconds').toISOString();

      params.qs.begin = end
        .subtract(size, unit)
        .subtract(10, 'seconds')
        .toISOString();
    }

    return params;
  }
};

export const getTimeParams = {
  getRequestDuration,
  getRequestRange
};
