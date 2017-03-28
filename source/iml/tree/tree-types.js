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

export const ADD_TREE_ITEMS = 'ADD_TREE_ITEMS';
export const TOGGLE_COLLECTION_OPEN = 'TOGGLE_COLLECTION_OPEN';
export const TOGGLE_ITEM_OPEN = 'TOGGLE_ITEM_OPEN';
export const RESET_STATE = 'RESET_STATE';
export const UPDATE_COLLECTION_OFFSET = 'UPDATE_COLLECTION_OFFSET';

export type treeActionsT =
  | addItemsActionT
  | toggleItemOpenT
  | toggleCollectionOpenT
  | updateCollectionOffsetT
  | resetStateT;
export type treeItemListT = treeItemT[];

export type addItemsActionT = {
  type: 'ADD_TREE_ITEMS',
  payload: treeItemListT
};

export type toggleCollectionOpenT = {
  type: 'TOGGLE_COLLECTION_OPEN',
  payload: {
    id: number,
    open: boolean
  }
};

export type updateCollectionOffsetT = {
  type: 'UPDATE_COLLECTION_OFFSET',
  payload: {
    id: number,
    offset: number
  }
};

export type toggleItemOpenT = {
  type: 'TOGGLE_ITEM_OPEN',
  payload: {
    id: number,
    itemId: number,
    open: boolean
  }
};

export type resetStateT = {
  type: 'RESET_STATE'
};

export type treeItemT = {
  treeId: number,
  open: boolean,
  opens: {
    [key: number]: boolean
  },
  parentTreeId: number,
  type: string,
  meta: Object,
  objects?: Object[],
  fsId?: string,
  hostId?: string
};

export type treeHashT = {
  [key: number]: treeItemT
};
