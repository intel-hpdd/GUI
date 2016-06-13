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

import {
  default as Maybe,
  withDefault
} from 'intel-maybe';

import {
  curry, map
} from 'intel-fp';

import rebindDestroy from '../highland/rebind-destroy.js';

import type {
  HighlandStreamT
} from 'highland';

import type {
  durationPayloadT
} from '../duration-picker/duration-picker-module.js';

import type {
  createStreamT
} from '../charting/charting-module.js';

import type {
  heatMapDurationPayloadT
} from '../read-write-heat-map/read-write-heat-map-module.js';

import type {
  filesystemQueryT,
  targetQueryT
} from '../dashboard/dashboard-module.js';

import type {
  getMdoStreamT
} from '../mdo/mdo-module.js';

type chartStreamsT = (x:durationPayloadT) => getMdoStreamT | (x:heatMapDurationPayloadT) => Function;

export const getConf = (page:string) => {
  return rebindDestroy(
    map(
      (x) => withDefault(
        () => x[''],
        Maybe.of(x[page])
      )
    )
  );
};

export function data$Fn (createStream:createStreamT) {
  'ngInject';

  return curry(3, (overrides:filesystemQueryT | targetQueryT, chartStreamFn:chartStreamsT,
    x:durationPayloadT):HighlandStreamT<mixed> => {

    var { durationStream, rangeStream } = createStream;
    durationStream = durationStream(overrides);
    rangeStream = rangeStream(overrides);

    switch (x.configType) {
    case 'duration':
      return durationStream(
        chartStreamFn(x),
        x.size,
        x.unit
      );
    default:
      return rangeStream(
        chartStreamFn(x),
        x.startDate,
        x.endDate
      );
    }
  });
}
