//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import formatBytes from '../number-formatters/format-bytes.js';

export default function throughput () {
  'ngInject';

  return function (bytes, bps, precision) {
    if (bps) bytes *= 8;

    var result = formatBytes(bytes, precision);
    if (bps) result = result.replace(/B/, 'b');
    return result ? result + '/s' : '';
  };
}
