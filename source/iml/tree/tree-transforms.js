// @flow

//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import highland from 'highland';
import * as obj from 'intel-obj';
import * as fp from 'intel-fp';
import * as maybe from 'intel-maybe';
import flatMapChanges from 'intel-flat-map-changes';

import {
  addCurrentPage
} from '../api-transforms.js';

import {
  addTreeItems,
  createItem
} from '../tree/tree-actions.js';

import type {
  Maybe
} from 'intel-maybe';

import type {
  treeItemT,
  treeHashT
} from './tree-types.js';

import type {
  HighlandStreamT
} from 'highland';

type treeItemToBooleanT = (x:treeItemT) => boolean;

type getChildByT = (fn:treeItemToBooleanT) => (x:HighlandStreamT<treeHashT>) => HighlandStreamT<Maybe<treeItemT>>;
export const getChildBy:getChildByT = fn => highland.map(
  fp.flow(
    obj.values,
    fp.filter(fn),
    x => maybe.of(x[0])
  )
);

export const emitOnItem = (fn:treeItemToBooleanT) =>
  fp.flow(
    getChildBy(fn),
    highland.map(
      maybe.withDefault(
        fp.always(false)
      )
    ),
    highland.filter(x => x)
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

export const transformItems = (fn:treeItemToBooleanT, structFn:() => {type:string, parentTreeId:number}, fnTo$:treeItemToStreamT) => {
  let latest = {};

  return fp.flow(
    getChildBy(fn),
    highland.map(
      maybe.withDefault(
        () => createItem(structFn())
      )
    ),
    highland.tap(x => latest = x),
    highland.filter(
      hasChanges(x => x.meta.offset)
    ),
    flatMapChanges(fnTo$),
    highland.map(
      addCurrentPage
    ),
    highland.map(
      x => Object.assign(latest, x)
    ),
    highland.map(
      x => addTreeItems([x])
    )
  );
};
