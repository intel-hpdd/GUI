// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Immutable from "seamless-immutable";

export const ADD_TARGET_ITEMS = "ADD_TARGET_ITEMS";
export const DELETE_TARGET_ITEM = "DELETE_TARGET_ITEM";
export const UPDATE_TARGET_ITEM = "UPDATE_TARGET_ITEM";

export type TargetT = {
  active_host: String,
  active_host_name: String,
  conf_params: Option<Object>,
  content_type_id: Number,
  failover_server_name: String,
  failover_servers: Array<String>,
  filesystem: Option<String>,
  filesystem_id: Option<Number>,
  filesystem_name: Option<String>,
  filesystems: Array<{ id: Number, name: String }>,
  ha_label: String,
  id: Number,
  immutable_state: boolean,
  index: Option<Number>,
  inode_count: String,
  inode_size: Number,
  kind: String,
  label: String,
  name: String,
  primary_server: String,
  primary_server_name: String,
  resource_uri: String,
  state: String,
  state_modified_at: String,
  uuid: String,
  volume: String,
  volume_name: String
};

export default function targetReducer(state = Immutable({}), { type, payload }) {
  switch (type) {
    case ADD_TARGET_ITEMS:
      return Immutable(payload);
    case UPDATE_TARGET_ITEM:
      return state.set(payload.id, payload);
    case DELETE_TARGET_ITEM:
      return state.without(payload);
    default:
      return state;
  }
}
