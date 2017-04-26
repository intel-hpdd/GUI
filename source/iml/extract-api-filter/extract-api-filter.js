// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import extractApi from '@mfl/extract-api';
import * as fp from '@mfl/fp';

type stringFn = (resourceUri: string) => string;
export default (): stringFn => fp.memoize(extractApi);
