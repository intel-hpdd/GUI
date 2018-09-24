import jobTreeFactory from "../../../../source/iml/command/job-tree-factory.js";
import jobFixtures from "../../../data-fixtures/job-fixtures.json";
import angular from "../../../angular-mock-setup.js";

describe("Job tree", function() {
  let jobTree;
  beforeEach(
    angular.mock.module($provide => {
      $provide.factory("jobTree", jobTreeFactory);
    })
  );

  beforeEach(
    angular.mock.inject(function(_jobTree_) {
      jobTree = _jobTree_;
    })
  );

  it("should convert a job tree", () => {
    jobFixtures.forEach(item => {
      const result = jobTree(item.in);

      expect(result).toEqual(item.out);
    });
  });
});
