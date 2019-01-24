// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { type LockT, type LockEntryT, LOCK_TYPE_READ, LOCK_TYPE_WRITE, type ReadOrWriteT } from "./locks-reducer.js";

const flattenLocks: LockT => LockEntryT[] = (locks: LockT) => ([].concat(...Object.values(locks)): any);

const getLocks = (type: ReadOrWriteT) => (locks: LockT) => {
  return flattenLocks(locks).filter((x: LockEntryT) => x.lock_type === type);
};

export const getReadLocks = getLocks(LOCK_TYPE_READ);
export const getWriteLocks = getLocks(LOCK_TYPE_WRITE);
export const getAllLocks = flattenLocks;
