// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { resolveStream } from '../promise-transforms.js';

import { waitForChartData } from '../chart-transformers/chart-transformers.js';

import type { HighlandStreamT } from 'highland';

type scopeToStreamToObject = ($scope: Object, s: HighlandStreamT<any>) => Object;

export default (template: string, stream: HighlandStreamT<mixed>, fn: scopeToStreamToObject): Promise<Object> =>
  resolveStream(stream.through(waitForChartData)).then(stream => {
    return {
      template,
      stream,
      chartFn: fn
    };
  });
