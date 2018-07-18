//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { formatBytes } from '@iml/number-formatters';

export default function throughput() {
  'ngInject';
  return function(bytes, bps, precision) {
    if (bps) bytes *= 8;

    let result = formatBytes(bytes, precision);
    if (bps) result = result.replace(/B/, 'b');
    return result ? result + '/s' : '';
  };
}
