// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import global from './global.js';

import {
  default as Maybe,
  withDefault
} from 'intel-maybe';

export default (arg:?(string | number)):Date => withDefault(
  () => new global.Date(),
  Maybe.of(arg)
    .map(x => new global.Date(x))
);
