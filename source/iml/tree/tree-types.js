// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const ADD_TREE_ITEMS = 'ADD_TREE_ITEMS';
export const TOGGLE_COLLECTION_OPEN = 'TOGGLE_COLLECTION_OPEN';
export const TOGGLE_ITEM_OPEN = 'TOGGLE_ITEM_OPEN';
export const RESET_STATE = 'RESET_STATE';
export const UPDATE_COLLECTION_OFFSET = 'UPDATE_COLLECTION_OFFSET';

export type treeActionsT = (
  addItemsActionT |
  toggleItemOpenT |
  toggleCollectionOpenT |
  updateCollectionOffsetT |
  resetStateT
);
export type treeItemListT = treeItemT[];

export type addItemsActionT = {
  type:'ADD_TREE_ITEMS',
  payload:treeItemListT
};

export type toggleCollectionOpenT = {
  type:'TOGGLE_COLLECTION_OPEN',
  payload:{
    id:number,
    open:boolean
  }
};

export type updateCollectionOffsetT = {
  type:'UPDATE_COLLECTION_OFFSET',
  payload:{
    id:number,
    offset:number
  }
};

export type toggleItemOpenT = {
  type:'TOGGLE_ITEM_OPEN',
  payload:{
    id:number,
    itemId:number,
    open:boolean
  }
};

export type resetStateT = {
  type:'RESET_STATE'
}

export type treeItemT = {
  treeId:number,
  open:boolean,
  opens:{
    [key: number]: boolean
  },
  parentTreeId:number,
  type:string,
  meta:Object,
  objects:Object[]
};

export type treeHashT = {
  [key: number]: treeItemT
};
