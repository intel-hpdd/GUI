//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from 'intel-lodash-mixins';
import highland from 'highland';

export default function objToPoints (s) {
  var reduce = highland.flip(_.partialRight(_.reduce, []));

  return s.flatMap(reduce(function flatten (arr, vals, key) {
    var setId = highland.flip(_.set('id'), key);
    var setName = highland.flip(_.set('name'), key);

    vals.map(setId);
    vals.map(setName);

    return arr.concat(vals);
  }));
}
