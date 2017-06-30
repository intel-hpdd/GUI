// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';
import { default as highland, type HighlandStreamT } from 'highland';

type Point = {
  ts: string,
  data: {}
};

export default (keys: string[]) => (s: HighlandStreamT<Point>) => {
  const struct = keys.map(key => ({ key: key, values: [] }));

  return s
    .collect()
    .tap(
      fp.map(point => {
        keys.forEach((key, index) => {
          struct[index].values.push({
            x: new Date(point.ts),
            y: point.data[key]
          });
        });
      })
    )
    .map(() => struct)
    .otherwise(highland([struct]));
};
