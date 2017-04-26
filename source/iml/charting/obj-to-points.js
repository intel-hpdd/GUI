//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { HighlandStreamT } from 'highland';

type ReturnValues = Object => Array<[string, Object[]]>;
const entries = ((Object.entries: any): ReturnValues);

export default (s: HighlandStreamT<Object>) =>
  s.flatMap(x =>
    entries(x).reduce(
      (out, [k: string, xs: Object[]]) =>
        out.concat(
          xs.map(x => ({
            ...x,
            id: k,
            name: k
          }))
        ),
      []
    )
  );
