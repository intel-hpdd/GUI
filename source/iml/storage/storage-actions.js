// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { StorageResourceClass, StorageResource } from './storage-types.js';

import {
  type Config,
  ADD_STORAGE_RESOURCE_CLASSES,
  ADD_STORAGE_RESOURCES,
  SET_STORAGE_SELECT_INDEX,
  SET_STORAGE_TABLE_LOADING,
  SET_STORAGE_CONFIG
} from './storage-reducer.js';

export const addStorageResourceClasses = (payload: StorageResourceClass[]) => ({
  type: ADD_STORAGE_RESOURCE_CLASSES,
  payload
});

export const addStorageResources = (payload: { objects: StorageResource[] }) => ({
  type: ADD_STORAGE_RESOURCES,
  payload
});

export const setStorageSelectIndex = (payload: number) => ({
  type: SET_STORAGE_SELECT_INDEX,
  payload
});

export const setStorageTableLoading = (payload: boolean) => ({
  type: SET_STORAGE_TABLE_LOADING,
  payload
});

export const setStorageConfig = (payload: $Shape<Config>) => ({
  type: SET_STORAGE_CONFIG,
  payload
});
