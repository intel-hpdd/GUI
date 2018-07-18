//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { HighlandStreamT } from 'highland';

export default (cmp: Function) => (s: HighlandStreamT<Object>) => s.uniqBy((a, b) => a.ts === b.ts && cmp(a, b));
