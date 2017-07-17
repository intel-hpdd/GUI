// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from '../store/get-store.js';
import { resolveStream } from '../promise-transforms.js';

import type { HighlandStreamT } from 'highland';

export function storage$(): Promise<HighlandStreamT<mixed>> {
  return resolveStream(store.select('storage'));
}
