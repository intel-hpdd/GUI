//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import {curry} from 'intel-fp';
import {always, map} from 'intel-fp';
import highland from 'highland';

export default curry(2, function toNvd3 (keys, s) {
  var struct = keys.map(function pushItem (key) {
    return { key: key, values: [] };
  });

  return s
    .collect()
    .tap(map(point => {
      keys.forEach(function createValue (key, index) {
        struct[index].values.push({
          x: new Date(point.ts),
          y: point.data[key]
        });
      });
    }))
    .map(always(struct))
    .otherwise(highland([struct]));
});
