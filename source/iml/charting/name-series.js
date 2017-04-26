//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { HighlandStreamT } from 'highland';

export default (seriesMap: Object) => (s: HighlandStreamT<Object>) =>
  s.map(x =>
    Object.entries(x).reduce(
      (out, [k, v]) => ({
        ...out,
        [seriesMap[k] || k]: v
      }),
      {}
    )
  );
