//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';
import _ from 'intel-lodash-mixins';

export default fp.curry2(function removeDupsFactory(cmp, s) {
  return s.uniqBy(function removeDups(a, b) {
    return _.eqProp('ts', a, b) && cmp(a, b);
  });
});
