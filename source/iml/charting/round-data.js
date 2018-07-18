//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from '@iml/lodash-mixins';

export default function roundData(s) {
  return s.map(function roundData(x) {
    x.data = _.mapValues(x.data, Math.round);

    return x;
  });
}
