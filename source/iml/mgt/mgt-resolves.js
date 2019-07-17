// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import store from "../store/get-store.js";
import broadcast from "../broadcaster.js";

import type { HighlandStreamT } from "highland";
import type { LockT } from "../locks/locks-reducer.js";

type fnToStream = () => HighlandStreamT<mixed>;

export function mgtAlertIndicatorB(): fnToStream {
  return broadcast(store.select("alertIndicators").map(Object.values));
}

export function locks$(): HighlandStreamT<LockT> {
  return store.select("locks");
}

export function mgt$(): HighlandStreamT<mixed> {
  return store
    .select("targets")
    .map(Object.values)
    .map(fp.filter(x => x.kind === "MGT"));
}
