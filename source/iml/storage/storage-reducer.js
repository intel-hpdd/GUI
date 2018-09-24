// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { StorageResourceClass, StorageResourceResponse } from "./storage-types.js";
import type { ActionT } from "../store/store-module.js";

export type Config = {
  selectIndex: ?number,
  sortKey: string,
  sortDesc: boolean,
  loading: boolean,
  entries: number,
  offset: number
};

export type State = {
  resourceClasses: ?(StorageResourceClass[]),
  resources: ?StorageResourceResponse,
  config: Config
};

export const ADD_STORAGE_RESOURCE_CLASSES = "ADD_STORAGE_RESOURCE_CLASSES";
export const ADD_STORAGE_RESOURCES = "ADD_STORAGE_RESOURCES";
export const SET_STORAGE_SELECT_INDEX = "SET_STORAGE_SELECT_INDEX";
export const SET_STORAGE_SORTING = "SET_STORAGE_SORTING";
export const SET_STORAGE_TABLE_LOADING = "SET_STORAGE_TABLE_LOADING";
export const SET_STORAGE_CONFIG = "SET_STORAGE_CONFIG";

export default function(
  state: State = {
    resourceClasses: null,
    resources: null,
    config: {
      selectIndex: null,
      sortKey: "",
      sortDesc: false,
      loading: false,
      entries: 10,
      offset: 0
    }
  },
  { type, payload }: ActionT
): State {
  switch (type) {
    case ADD_STORAGE_RESOURCE_CLASSES:
      return {
        ...state,
        resourceClasses: payload
      };
    case ADD_STORAGE_RESOURCES:
      return {
        ...state,
        resources: payload
      };
    case SET_STORAGE_SELECT_INDEX:
      return {
        ...state,
        config: {
          ...state.config,
          selectIndex: payload,
          sortKey: "",
          sortDesc: false,
          loading: false,
          entries: 10,
          offset: 0
        }
      };
    case SET_STORAGE_SORTING:
      return {
        ...state,
        config: {
          ...state.config,
          ...handleSorting(state, payload)
        }
      };
    case SET_STORAGE_TABLE_LOADING:
      if (payload === state.config.loading) return state;

      return {
        ...state,
        config: {
          ...state.config,
          loading: payload
        }
      };
    case SET_STORAGE_CONFIG:
      return {
        ...state,
        config: {
          ...state.config,
          ...payload
        }
      };
    default:
      return state;
  }
}

function handleSorting(lastState: State, sortKey: string) {
  let sortDesc = false;

  if (lastState.config.sortKey === sortKey) sortDesc = true;

  return {
    sortKey,
    sortDesc
  };
}
