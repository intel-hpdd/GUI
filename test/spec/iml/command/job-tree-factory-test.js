import commandModule from '../../../../source/iml/command/command-module';
import jobFixtures from '../../../data-fixtures/job-fixtures';

describe('Job tree', function () {
  beforeEach(module(commandModule));

  var jobTree;

  beforeEach(inject(function (_jobTree_) {
    jobTree = _jobTree_;
  }));

  it('should convert a job tree', function () {
    jobFixtures.forEach(function testItem (item) {
      var result = jobTree(item.in);

      expect(result).toEqual(item.out);
    });
  });
});
