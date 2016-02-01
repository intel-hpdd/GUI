import _ from 'intel-lodash-mixins';

import filtersModule from '../../../../source/iml/filters/filters-module';

describe('Paginate filter', function () {
  var paginate, items;

  beforeEach(module(filtersModule));

  beforeEach(inject(function ($filter) {
    paginate = $filter('paginate');
  }));

  describe('General Pagination', function () {
    beforeEach(function () {
      items = _.range(0, 99);
    });

    it('should display the first 5 items in the array', function () {
      var itemsToDisplay = paginate(items, 0, 5);
      expect(itemsToDisplay).toEqual(_.range(0, 5));
    });

    it('should display items 30 through 34', function () {
      var itemsToDisplay = paginate(items, 6, 5);
      expect(itemsToDisplay).toEqual(_.range(30, 35));
    });

    it('should display the last 5 items', function () {
      var itemsToDisplay = paginate(items, 19, 5);
      expect(itemsToDisplay).toEqual(_.range(95, 99));
    });
  });
});
