//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';
import _ from 'intel-lodash-mixins';

export default fp.curry2(function nameSeries (seriesMap, s) {
  return s.map(function transformSeries (x) {
    return _.transform(x, function (result, value, key) {
      var newKey = seriesMap[key] || key;
      result[newKey] = value;
    });
  });
});
