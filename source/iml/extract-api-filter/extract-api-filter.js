// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import extractApi from "@iml/extract-api";
import * as fp from "@iml/fp";

type stringFn = (resourceUri: string) => string;
export default (): stringFn => fp.memoize(extractApi);
