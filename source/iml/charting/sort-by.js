//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';

export default fp.curry2(function sortBy (cmp, s) {
  return s.collect()
    .invoke('sort', [cmp])
    .sequence();
});
