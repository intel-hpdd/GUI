// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';
import extractApiId from '@iml/extract-api';

const viewLens = fp.flow(
  fp.lensProp,
  fp.view
);

export default function filterTargetByHost(id: number) {
  const failoverServersLens = viewLens('failover_servers');
  const primaryServer = viewLens('primary_server');

  const getFailover = fp.cond(
    [
      fp.flow(
        failoverServersLens,
        Array.isArray
      ),
      failoverServersLens
    ],
    [fp.always(true), fp.always([])]
  );

  const concat = (fnA, fnB) => x => fnA(x).concat(fnB(x));

  const eqId = fp.filter(fp.eqFn(fp.identity)(extractApiId)(id));
  const lengthProp = viewLens('length');

  return fp.map(
    fp.filter(
      fp.flow(
        concat(getFailover, primaryServer),
        eqId,
        lengthProp
      )
    )
  );
}
