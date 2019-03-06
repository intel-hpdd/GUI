// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { type HsmControlParamT } from "../hsm/hsm-module.js";

export const ACTION_DROPDOWN_FLAG_CHECK_DEPLOY: "check_deploy" = "check_deploy";
export type ActionDropdownFlagT = typeof ACTION_DROPDOWN_FLAG_CHECK_DEPLOY;

export type SelectedActionT = {|
  args: {|
    host_id: number
  |},
  class_name: string,
  composite_id: string,
  confirmation: string,
  display_group: number,
  display_order: number,
  long_description: string,
  state: string,
  verb: string
|};

export type RecordT = {
  content_type_id: number,
  id: number,
  label: string,
  resource_uri: string,
  state?: string,
  address?: string,
  server_profile?: {
    initial_state: string
  },
  install_method?: string
};

export type RecordAndSelectedActionT = {|
  available_action: SelectedActionT,
  record: RecordT,
  flag: ?ActionDropdownFlagT
|};

export type RecordAndHsmControlParamT = {|
  record: RecordT,
  hsm_control_param: HsmControlParamT
|};
