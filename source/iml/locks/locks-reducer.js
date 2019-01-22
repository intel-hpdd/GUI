// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Immutable from "seamless-immutable";

export const UPDATE_LOCKS_ACTION: "UPDATE_LOCKS" = "UPDATE_LOCKS";

export const LOCK_ACTION_ADD: "add" = "add";
export const LOCK_ACTION_REMOVE: "remove" = "remove";

export const LOCK_TYPE_READ: "read" = "read";
export const LOCK_TYPE_WRITE: "write" = "write";

type ContentTypeIdT = string;
type ResourceIdT = string;
type LockKeyT = ContentTypeIdT | ":" | ResourceIdT;

type LockEntryT = {|
  action: LOCK_ACTION_ADD | LOCK_ACTION_REMOVE,
  content_type_id: number,
  description: string,
  item_id: number,
  job_id: number,
  lock_type: LOCK_TYPE_READ | LOCK_TYPE_WRITE
|};

type LockT = {|
  [key: LockKeyT]: LockEntryT[]
|};

type LockActionT = {|
  type: UPDATE_LOCKS_ACTION,
  payload: LockT
|};

export default function locksReducer(state: LockT = Immutable({}), { type, payload }: LockActionT): LockT {
  switch (type) {
    case UPDATE_LOCKS_ACTION:
      return Immutable(payload);
    default:
      return state;
  }
}
