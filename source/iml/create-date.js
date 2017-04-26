// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as maybe from '@mfl/maybe';
import global from './global.js';

export default (arg: ?(string | number)): Date =>
  maybe.withDefault(
    () => new global.Date(),
    maybe.map(x => new global.Date(x), maybe.of(arg))
  );
