// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const ADD_FS_ITEMS = "ADD_FS_ITEMS";
export const DELETE_FILESYSTEM_ITEM = "DELETE_FILESYSTEM_ITEM";
export const UPDATE_FILESYSTEM_ITEM = "UPDATE_FILESYSTEM_ITEM";

import { type TargetT } from "../target/target-reducer.js";

export type FilesystemT = {
  bytes_free: Number,
  bytes_total: Number,
  cdt_mdt: String,
  cdt_status: Option<String>,
  client_count: Number,
  conf_params: Option<Object>,
  content_type_id: Number,
  files_free: Number,
  files_total: Number,
  hsm_control_params: Object,
  id: Number,
  immutable_state: boolean,
  label: String,
  mdts: Array<TargetT>,
  mgt: String,
  mount_command: String,
  mount_path: String,
  name: String,
  osts: Array<String>,
  resource_uri: String,
  state: String,
  state_modified_at: String
};

import Immutable from "seamless-immutable";

export default function(state = Immutable({}), { type, payload }) {
  switch (type) {
    case ADD_FS_ITEMS:
      return Immutable(payload);
    case UPDATE_FILESYSTEM_ITEM:
      return state.set(payload.id, payload);
    case DELETE_FILESYSTEM_ITEM:
      return state.without(payload);
    default:
      return state;
  }
}
