// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { type LockT, type LockEntryT, LOCK_TYPE_READ, LOCK_TYPE_WRITE, type ReadOrWriteT } from "./locks-reducer.js";

const flattenLocks: LockT => LockEntryT[] = (locks: LockT) => ([].concat(...Object.values(locks)): any);

const getLocks = (type: ReadOrWriteT) => (contentTypeId: string, recordId: string, locks: LockT) => {
  return flattenLocks(locks).filter(
    (x: LockEntryT) => x.lock_type === type && x.content_type_id === contentTypeId && x.item_id === recordId
  );
};

export type GetTypeLocksT = (contentTypeId: string, recordId: string, locks: LockT) => LockEntryT[];

export const getReadLocks: GetTypeLocksT = getLocks(LOCK_TYPE_READ);
export const getWriteLocks: GetTypeLocksT = getLocks(LOCK_TYPE_WRITE);
export const getAllLocks = flattenLocks;

const getDifference = (set1: Set<string>, set2: Set<string>) => new Set([...set1].filter(x => !set2.has(x)));
export const getLocksDiff = (
  currentMessages: string[],
  newMessages: string[],
  messageDifferences: string[]
): string[] => {
  const m1: Set<string> = new Set(currentMessages);
  const d1: Set<string> = new Set(messageDifferences);
  const m2: Set<string> = new Set(newMessages);

  const differences = new Set([...d1].concat([...getDifference(m1, m2)]));

  return [...differences];
};
