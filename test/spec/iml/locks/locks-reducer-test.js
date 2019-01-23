// @flow

import locksReducer, { UPDATE_LOCKS_ACTION, type LockT } from "../../../../source/iml/locks/locks-reducer.js";

describe("locksReducer", () => {
  let sampleData: LockT;

  beforeEach(() => {
    sampleData = {
      "62:1": [
        {
          action: "add",
          content_type_id: 62,
          description: "Start monitoring LNet on mds1.local",
          item_id: 1,
          job_id: 47,
          lock_type: "read"
        },
        {
          action: "add",
          content_type_id: 62,
          description: "Install packages on mds1.local",
          item_id: 1,
          job_id: 46,
          lock_type: "write"
        }
      ]
    };
  });

  describe("updating locks", () => {
    describe("from an empty state", () => {
      it("should return the new state", () => {
        const result = locksReducer({}, { type: UPDATE_LOCKS_ACTION, payload: sampleData });
        expect(result).toEqual(sampleData);
      });
    });

    describe("from an existing state", () => {
      it("should return the new state", () => {
        const existingState = {
          "62:1": [
            { ...sampleData["62:1"][0] },
            { ...sampleData["62:1"][1], description: "Some initial task", job_id: 263 }
          ]
        };
        const result = locksReducer(existingState, { type: UPDATE_LOCKS_ACTION, payload: sampleData });
        expect(result).toEqual(sampleData);
      });
    });
  });
});
