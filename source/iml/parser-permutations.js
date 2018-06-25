// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';

const modifiers = ['__in', '__contains', '__startswith', '__endswith', '__gte', '__gt', '__lte', '__lt'];

export default (items: Array<string>) =>
  fp
    .xProd(items)(modifiers)
    .map(x => x.join(''))
    .concat(items)
    .join('&');
