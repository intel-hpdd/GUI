// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { durationPayloadT } from './duration-picker-module.js';
import type { heatMapDurationPayloadT } from '../read-write-heat-map/read-write-heat-map-module.js';
import getServerMoment from '../get-server-moment.js';

type durationPayloadsT = heatMapDurationPayloadT | durationPayloadT;

export default (overrides: Object): durationPayloadsT =>
  Object.assign(
    {
      configType: 'duration',
      size: 10,
      unit: 'minutes',
      startDate: getServerMoment()
        .subtract(10, 'minutes')
        .seconds(0)
        .milliseconds(0)
        .toDate()
        .valueOf(),
      endDate: getServerMoment()
        .seconds(0)
        .milliseconds(0)
        .toDate()
        .valueOf()
    },
    overrides
  );
