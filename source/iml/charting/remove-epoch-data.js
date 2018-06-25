//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { HighlandStreamT } from 'highland';

export default (s: HighlandStreamT<Object>) => s.filter(x => new Date(x.ts).getTime() > 0);
