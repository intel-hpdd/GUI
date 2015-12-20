import angular from 'angular';
const {module, inject} = angular.mock;

describe('ordering groups', function () {
  beforeEach(module('action-dropdown-module', 'dataFixtures'));

  var groupActionsFilter, groupActionsFixtures;

  beforeEach(inject(function ($filter, _groupActionsFixtures_) {
    groupActionsFilter = $filter('groupActions');
    groupActionsFixtures = _groupActionsFixtures_;
  }));

  it('should work', function () {
    groupActionsFixtures.forEach(function testItem (item) {
      var result = groupActionsFilter(item.in);

      expect(result).toEqual(item.out);
    });
  });
});
