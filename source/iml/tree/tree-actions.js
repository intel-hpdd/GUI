// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { ADD_TREE_ITEMS, TOGGLE_COLLECTION_OPEN, TOGGLE_ITEM_OPEN, UPDATE_COLLECTION_OFFSET } from './tree-types.js';

import type { treeItemT } from './tree-types.js';

export function addTreeItems(payload: treeItemT[]) {
  return {
    type: ADD_TREE_ITEMS,
    payload
  };
}

export const toggleCollectionOpen = (id: number, open: boolean) => {
  return {
    type: TOGGLE_COLLECTION_OPEN,
    payload: {
      id,
      open
    }
  };
};

export const toggleItemOpen = (id: number, itemId: number, open: boolean) => {
  return {
    type: TOGGLE_ITEM_OPEN,
    payload: {
      id,
      itemId,
      open
    }
  };
};

export const updateCollectionOffset = (id: number, offset: number) => {
  return {
    type: UPDATE_COLLECTION_OFFSET,
    payload: {
      id,
      offset
    }
  };
};

let id = 1;

export const createItem = (x: { type: string, parentTreeId: number }) => ({
  ...x,
  treeId: id++,
  open: false,
  opens: {},
  meta: {
    offset: 0,
    limit: 50
  }
});
