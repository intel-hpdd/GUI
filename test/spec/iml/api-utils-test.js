// @flow

import { compositeIdsToQueryString, type CompositeIdT } from "../../../source/iml/api-utils.js";

describe("api utils", () => {
  describe("compositeIdsToQueryString", () => {
    let compositeIds: CompositeIdT[];
    beforeEach(() => {
      compositeIds = [
        { contentTypeId: "62", id: "1" },
        { contentTypeId: "62", id: "2" },
        { contentTypeId: "62", id: "3" },
        { contentTypeId: "62", id: "4" }
      ];
    });

    it("should convert an array of Composite Ids to a query string", () => {
      expect(compositeIdsToQueryString(compositeIds)).toEqual(
        "composite_ids=62:1&composite_ids=62:2&composite_ids=62:3&composite_ids=62:4"
      );
    });
  });
});
