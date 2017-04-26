import actionDropdownModule
  from '../../../../source/iml/action-dropdown/action-dropdown-module';
import groupActionsFixtures
  from '../../../data-fixtures/group-actions-fixtures.json';

describe('ordering groups', () => {
  beforeEach(module(actionDropdownModule));

  let groupActionsFilter;

  beforeEach(
    inject($filter => {
      groupActionsFilter = $filter('groupActions');
    })
  );

  it('should work', () => {
    groupActionsFixtures.forEach(function testItem(item) {
      const result = groupActionsFilter(item.in);

      expect(result).toEqual(item.out);
    });
  });
});
