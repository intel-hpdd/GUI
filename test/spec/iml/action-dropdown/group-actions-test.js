import groupActions
  from '../../../../source/iml/action-dropdown/group-actions.js';
import groupActionsFixtures
  from '../../../data-fixtures/group-actions-fixtures.json';

describe('ordering groups', () => {
  let groupActionsFilter;
  beforeEach(() => {
    groupActionsFilter = groupActions();
  });

  it('should work', () => {
    groupActionsFixtures.forEach(item => {
      const result = groupActionsFilter(item.in);
      expect(result).toEqual(item.out);
    });
  });
});
