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

import {
  ADD_TREE_ITEMS,
  TOGGLE_COLLECTION_OPEN,
  TOGGLE_ITEM_OPEN,
  UPDATE_COLLECTION_OFFSET
} from './tree-types.js';

import type {
  treeItemT
} from './tree-types.js';

export function addTreeItems (payload:treeItemT[]) {
  return {
    type: ADD_TREE_ITEMS,
    payload
  };
}

export const toggleCollectionOpen = (id:number, open:boolean) => {
  return {
    type: TOGGLE_COLLECTION_OPEN,
    payload: {
      id,
      open
    }
  };
};

export const toggleItemOpen = (id:number, itemId:number, open:boolean) => {
  return {
    type: TOGGLE_ITEM_OPEN,
    payload: {
      id,
      itemId,
      open
    }
  };
};

export const updateCollectionOffset = (id:number, offset:number) => {
  return {
    type: UPDATE_COLLECTION_OFFSET,
    payload: {
      id,
      offset
    }
  };
};

let id = 1;

export const createItem = (x:{type:string, parentTreeId:number}) => ({
  ...x,
  treeId: id++,
  open: false,
  opens: {},
  meta: {
    offset: 0,
    limit: 50
  }
});
