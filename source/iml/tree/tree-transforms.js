// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as obj from 'intel-obj';
import * as fp from 'intel-fp';
import flatMapChanges from 'intel-flat-map-changes';

import {
  addCurrentPage
} from '../api-transforms.js';

import {
  addTreeItems,
  createItem
} from '../tree/tree-actions.js';

import {
  default as Maybe,
  withDefault
} from 'intel-maybe';

import type {
  treeItemT
} from './tree-types.js';

import type {
  HighlandStreamT
} from 'highland';

type treeItemToBooleanT = (x:treeItemT) => boolean;

export const getChildBy = (fn:treeItemToBooleanT) => fp.map(
  fp.flow(
    obj.values,
    fp.filter(fn),
    x => Maybe.of(x[0])
  )
);

export const emitOnItem = (fn:treeItemToBooleanT) => fp.flow(
  getChildBy(fn),
  fp.map(
    withDefault(
      fp.always(false)
    )
  ),
  fp.filter(x => x)
);

export const hasChanges = (fn:treeItemToObjectT) => {
  let last;

  return (x:treeItemT) => {
    const item = fn(x);

    if (last === item)
      return false;

    last = item;

    return true;
  };
};

type treeItemToObjectT = (x:treeItemT) => Object;
type treeItemToStreamT = (x:treeItemT) => HighlandStreamT<Object>;

export const transformItems = (fn:treeItemToBooleanT, structFn:() => Object, fnTo$:treeItemToStreamT) => {
  let latest = {};

  return fp.flow(
    getChildBy(fn),
    fp.map(
      withDefault(() => createItem(structFn()))
    ),
    fp.tap(x => latest = x),
    fp.filter(
      hasChanges(x => x.meta.offset)
    ),
    flatMapChanges(fnTo$),
    fp.map(
      addCurrentPage
    ),
    fp.map(
      x => Object.assign(latest, x)
    ),
    fp.map(
      x => addTreeItems([x])
    )
  );
};
