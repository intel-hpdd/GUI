import actionDropdownModule from '../../../../source/iml/action-dropdown/action-dropdown-module';
import groupActionsFixtures from '../../../data-fixtures/group-actions-fixtures';


describe('ordering groups', () => {
  beforeEach(module(actionDropdownModule));

  var groupActionsFilter;

  beforeEach(inject(($filter) => {
    groupActionsFilter = $filter('groupActions');
  }));

  it('should work', () => {
    groupActionsFixtures.forEach(function testItem (item) {
      var result = groupActionsFilter(item.in);

      expect(result).toEqual(item.out);
    });
  });
});
