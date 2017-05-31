// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';
import extractApiId from 'intel-extract-api';

const viewLens = fp.flow(fp.lensProp, fp.view);

export default function filterTargetByHost (id:number) {
  var failoverServersLens = viewLens('failover_servers');
  var primaryServer = viewLens('primary_server');

  var getFailover = fp.cond(
    [fp.flow(failoverServersLens, Array.isArray), failoverServersLens],
    [fp.always(true), fp.always([])]
  );

  var concat = fp.curry(3, function concat (fnA, fnB, x) {
    return fnA(x).concat(fnB(x));
  });

  var eqId = fp.filter(fp.eqFn(fp.identity, extractApiId, id));
  var lengthProp = viewLens('length');

  return fp.map(fp.filter(fp.flow(concat(getFailover, primaryServer), eqId, lengthProp)));
}
