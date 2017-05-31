//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

// @flow

import {
  xProd
} from 'intel-fp';

const modifiers = [
  '__in',
  '__contains',
  '__startswith',
  '__endswith',
  '__gte',
  '__gt',
  '__lte',
  '__lt'
];

export default (items:Array<string>) =>
    xProd(items, modifiers)
    .map(x => x.join(''))
    .concat(items)
    .join('&');
