// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import getServerMoment from '../get-server-moment.js';
import sortByDate from './sort-by-date.js';

import type { HighlandStreamT } from 'highland';

export default function bufferDataNewerThan(size: number | string, unit: string) {
  let buffer = [];

  return function bufferDataNewerThanInner(s: HighlandStreamT<*>) {
    let leadingEdge;

    return s
      .collect()
      .tap(() => {
        leadingEdge = getServerMoment()
          .milliseconds(0)
          .subtract(size, unit);

        const secs = leadingEdge.seconds();
        leadingEdge.seconds(secs - (secs % 10));

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
