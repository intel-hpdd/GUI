// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Immutable from "seamless-immutable";

export const ADD_SERVER_ITEMS = "ADD_SERVER_ITEMS";
export const DELETE_SERVER_ITEM = "DELETE_SERVER_ITEM";
export const UPDATE_SERVER_ITEM = "UPDATE_SERVER_ITEM";

export type ServerT = {
  address: String,
  boot_time: String,
  client_mounts: Array<String>,
  content_type_id: Number,
  corosync_configuration: String,
  corosync_ring0: String,
  fqdn: String,
  id: Number,
  immutable_state: Boolean,
  install_method: String,
  label: String,
  lnet_configuration: String,
  member_of_active_filesystem: Boolean,
  needs_update: Boolean,
  nids: Array<String>,
  nodename: String,
  pacemaker_configuration: String,
  private_key: Option<String>,
  private_key_passphrase: Option<String>,
  properties: String,
  resource_uri: String,
  root_pw: Option<String>,
  server_profile: Object,
  state: String,
  state_modified_at: String
};

export default function(state = Immutable({}), { type, payload }) {
  switch (type) {
    case ADD_SERVER_ITEMS:
      return Immutable(payload);
    case UPDATE_SERVER_ITEM:
      return state.set(payload.id, payload);
    case DELETE_SERVER_ITEM:
      return state.without(payload);
    default:
      return state;
  }
}
