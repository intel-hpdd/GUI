// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';
import highland from 'highland';

export default fp.curry2((keys, s) => {
  const struct = keys.map(function pushItem(key) {
    return { key: key, values: [] };
  });

  return s
    .collect()
    .tap(
      fp.map(point => {
        keys.forEach(function createValue(key, index) {
          struct[index].values.push({
            x: new Date(point.ts),
            y: point.data[key]
          });
        });
      })
    )
    .map(fp.always(struct))
    .otherwise(highland([struct]));
});
