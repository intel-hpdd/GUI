// @flow

import { getReadLocks, getWriteLocks, getAllLocks, getLocksDiff } from "../../../../source/iml/locks/locks-utils.js";
import type { LockT, LockEntryT } from "../../../../source/iml/locks/locks-reducer.js";

describe("locks utils", () => {
  let locks: LockT, selectedLocks: LockEntryT[];
  beforeEach(() => {
    locks = {
      "98:1": [
        {
          action: "add",
          content_type_id: 98,
          description: "Some write lock",
          item_id: 1,
          job_id: 7,
          lock_type: "write"
        },
        {
          action: "remove",
          content_type_id: 98,
          description: "Some write lock2",
          item_id: 1,
          job_id: 6,
          lock_type: "write"
        },
        {
          action: "add",
          content_type_id: 98,
          description: "Some read lock",
          item_id: 1,
          job_id: 13,
          lock_type: "read"
        }
      ],
      "67:13": [
        {
          action: "add",
          content_type_id: 67,
          description: "Some write lock",
          item_id: 13,
          job_id: 2,
          lock_type: "write"
        },
        {
          action: "remove",
          content_type_id: 67,
          description: "Some read lock",
          item_id: 13,
          job_id: 3,
          lock_type: "write"
        }
      ]
    };
  });

  describe("getReadLocks", () => {
    it("should return the read locks for composite id 98:1", () => {
      selectedLocks = getReadLocks(98, 1, locks);
      expect(selectedLocks).toEqual([
        {
          action: "add",
          content_type_id: 98,
          description: "Some read lock",
          item_id: 1,
          job_id: 13,
          lock_type: "read"
        }
      ]);
    });

    it("should return the read locks for composite id 67:13", () => {
      selectedLocks = getReadLocks(67, 13, locks);
      expect(selectedLocks).toEqual([]);
    });

    it("should return nothing when the composite id doesn't match", () => {
      selectedLocks = getReadLocks(1, 2, locks);
      expect(selectedLocks).toEqual([]);
    });
  });

  describe("write locks", () => {
    it("should return the write locks for composite id 98:1", () => {
      selectedLocks = getWriteLocks(98, 1, locks);
      expect(selectedLocks).toEqual([
        {
          action: "add",
          content_type_id: 98,
          description: "Some write lock",
          item_id: 1,
          job_id: 7,
          lock_type: "write"
        },
        {
          action: "remove",
          content_type_id: 98,
          description: "Some write lock2",
          item_id: 1,
          job_id: 6,
          lock_type: "write"
        }
      ]);
    });

    it("should return the write locks for composite id 67:13", () => {
      selectedLocks = getWriteLocks(67, 13, locks);
      expect(selectedLocks).toEqual([
        {
          action: "add",
          content_type_id: 67,
          description: "Some write lock",
          item_id: 13,
          job_id: 2,
          lock_type: "write"
        },
        {
          action: "remove",
          content_type_id: 67,
          description: "Some read lock",
          item_id: 13,
          job_id: 3,
          lock_type: "write"
        }
      ]);
    });

    it("should return nothing when the composite id doesn't match", () => {
      selectedLocks = getWriteLocks(1, 2, locks);
      expect(selectedLocks).toEqual([]);
    });
  });

  describe("get all locks", () => {
    it("should return all locks in the map", () => {
      selectedLocks = getAllLocks(locks);
      expect(selectedLocks).toEqual([
        {
          action: "add",
          content_type_id: 98,
          description: "Some write lock",
          item_id: 1,
          job_id: 7,
          lock_type: "write"
        },
        {
          action: "remove",
          content_type_id: 98,
          description: "Some write lock2",
          item_id: 1,
          job_id: 6,
          lock_type: "write"
        },
        {
          action: "add",
          content_type_id: 98,
          description: "Some read lock",
          item_id: 1,
          job_id: 13,
          lock_type: "read"
        },
        {
          action: "add",
          content_type_id: 67,
          description: "Some write lock",
          item_id: 13,
          job_id: 2,
          lock_type: "write"
        },
        {
          action: "remove",
          content_type_id: 67,
          description: "Some read lock",
          item_id: 13,
          job_id: 3,
          lock_type: "write"
        }
      ]);
    });
  });

  describe("difference", () => {
    let currentMessages, newMessages, messageDifferences;
    beforeEach(() => {
      currentMessages = ["how now brown cow", "the upside down house", "once upon a time"];
      newMessages = ["the path", "how now brown cow", "excerpts from narnia", "once upon a time"];
      messageDifferences = ["existing difference"];
    });

    it("should compute the difference", () => {
      messageDifferences = getLocksDiff(currentMessages, newMessages, messageDifferences);
      expect(messageDifferences).toEqual(["existing difference", "the upside down house"]);
    });
  });
});
