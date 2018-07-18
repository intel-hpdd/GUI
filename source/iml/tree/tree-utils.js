// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from '../store/get-store.js';

import { toggleCollectionOpen, toggleItemOpen, updateCollectionOffset } from './tree-actions.js';

export const toggleCollection = (id: number, open: boolean): void => {
  store.dispatch(toggleCollectionOpen(id, open));
};

export const toggleItem = (id: number, itemId: number, open: boolean): void => {
  store.dispatch(toggleItemOpen(id, itemId, open));
};

export const updateCollOffset = (id: number, offset: number): void => {
  store.dispatch(updateCollectionOffset(id, offset));
};
