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

import getServerMoment from '../get-server-moment.js';
import sortByDate from './sort-by-date.js';

import type { HighlandStreamT } from 'highland';

export default function bufferDataNewerThan(
  size: number | string,
  unit: string
) {
  let buffer = [];

  return function bufferDataNewerThanInner(s: HighlandStreamT<*>) {
    let leadingEdge;

    return s
      .collect()
      .tap(() => {
        leadingEdge = getServerMoment().milliseconds(0).subtract(size, unit);

        const secs = leadingEdge.seconds();
        leadingEdge.seconds(secs - secs % 10);

        leadingEdge = leadingEdge.valueOf();
      })
      .flatMap(x => buffer.concat(x))
      .filter(point => new Date(point.ts).valueOf() >= leadingEdge)
      .through(sortByDate)
      .collect()
      .tap(x => (buffer = x))
      .flatten();
  };
}
