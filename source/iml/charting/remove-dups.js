//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from 'intel-lodash-mixins';

export default function removeDupsFactory(s) {
  return s.uniqBy(_.eqProp('ts'));
}
