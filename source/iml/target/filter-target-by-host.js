// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import extractApiId from "@iml/extract-api";

type targetServersT = {|
  failover_servers: string[],
  primary_server: string
|};

export default function filterTargetByHost(id: number) {
  const failoverServersLens = (x: targetServersT) => x.failover_servers;
  const primaryServer = (x: targetServersT) => x.primary_server;

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

  const concat = (fnA, fnB) => (x: targetServersT) => fnA(x).concat(fnB(x));

  const eqId = fp.filter(fp.eqFn(fp.identity)(extractApiId)(id));

  const filterById = fp.flow(
    concat(getFailover, primaryServer),
    eqId,
    x => x.length > 0
  );

  return fp.map(fp.filter(filterById));
}
