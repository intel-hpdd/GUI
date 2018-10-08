// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from "highland";
import * as obj from "@iml/obj";
import * as fp from "@iml/fp";
import * as maybe from "@iml/maybe";
import flatMapChanges from "@iml/flat-map-changes";

import { addCurrentPage } from "../api-transforms.js";

import { addTreeItems, createItem } from "../tree/tree-actions.js";

import { smartSpread } from "../immutability-utils";

import type { Maybe } from "@iml/maybe";

import type { treeItemT, treeHashT } from "./tree-types.js";

import type { HighlandStreamT } from "highland";

type treeItemToBooleanT = (x: treeItemT) => boolean;

type getChildByT = (fn: treeItemToBooleanT) => (x: HighlandStreamT<treeHashT>) => HighlandStreamT<Maybe<treeItemT>>;
export const getChildBy: getChildByT = fn =>
  highland.map(
    fp.flow(
      obj.values,
      fp.filter(fn),
      x => maybe.of(x[0])
    )
  );

export const emitOnItem = (fn: treeItemToBooleanT) =>
  fp.flow(
    getChildBy(fn),
    highland.map(maybe.withDefault.bind(null, fp.always(false))),
    highland.filter(x => x)
  );

export const hasChanges = (fn: treeItemToObjectT) => {
  let last;

  return (x: treeItemT) => {
    const item = fn(x);

    if (last === item) return false;

    last = item;

    return true;
  };
};

type treeItemToObjectT = (x: treeItemT) => Object;
type treeItemToStreamT = (x: treeItemT) => HighlandStreamT<Object>;

export const transformItems = (
  fn: treeItemToBooleanT,
  structFn: () => { type: string, parentTreeId: number },
  fnTo$: treeItemToStreamT
) => {
  let latest = {};

  return fp.flow(
    getChildBy(fn),
    highland.map(maybe.withDefault.bind(null, () => createItem(structFn()))),
    highland.tap(x => (latest = x)),
    highland.filter(hasChanges(x => x.meta.offset)),
    flatMapChanges.bind(null, fnTo$),
    highland.map(addCurrentPage),
    highland.map(x => smartSpread(latest, x)),
    highland.map(x => addTreeItems([x]))
  );
};
