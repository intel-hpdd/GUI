// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const ACTION_DROPDOWN_SELECT_ACTION: "SELECT_ACTION" = "SELECT_ACTION";
export const ACTION_DROPDOWN_RESET_SELECTED_ACTION: "RESET_SELECTED_ACTION" = "RESET_SELECTED_ACTION";

import Immutable from "seamless-immutable";

type SelectedActionT = {|
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

type LabelT = string;
type ResourceUriT = string;
type RecordT = [number, number, LabelT, ResourceUriT];

export type SelectedActionAndRecordT = {| available_action: SelectedActionT, record: RecordT |} | {||};

export type SelectActionT = {|
  type: typeof ACTION_DROPDOWN_SELECT_ACTION,
  payload: SelectedActionAndRecordT
|};

export type ResetSelectedActionT = {|
  type: typeof ACTION_DROPDOWN_RESET_SELECTED_ACTION,
  payload: {||}
|};

export type ActionDropdownActionsT = SelectActionT | ResetSelectedActionT;

export default function(
  state: SelectedActionAndRecordT = Immutable({}),
  action: ActionDropdownActionsT
): SelectedActionAndRecordT {
  switch (action.type) {
    case ACTION_DROPDOWN_SELECT_ACTION:
      return Immutable.merge({ ...action.payload });
    case ACTION_DROPDOWN_RESET_SELECTED_ACTION:
      return Immutable.merge({});
    default:
      return state;
  }
}
