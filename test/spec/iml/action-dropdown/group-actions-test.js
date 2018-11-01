import groupActions from "../../../../source/iml/action-dropdown/group-actions.js";
import groupActionsFixtures from "../../../data-fixtures/group-actions-fixtures.json";

describe("ordering groups", () => {
  it("should work", () => {
    groupActionsFixtures.forEach(item => {
      const result = groupActions(item.in);
      expect(result).toEqual(item.out);
    });
  });
});
