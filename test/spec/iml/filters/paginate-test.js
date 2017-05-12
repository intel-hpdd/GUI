import _ from '@mfl/lodash-mixins';

import '../../../angular-mock-setup.js';
import paginateFilter from '../../../../source/iml/filters/paginate-filter';

describe('Paginate filter', function() {
  let paginate, items;

  beforeEach(
    inject(() => {
      paginate = paginateFilter();
    })
  );

  describe('General Pagination', function() {
    beforeEach(function() {
      items = _.range(0, 99);
    });

    it('should display the first 5 items in the array', function() {
      const itemsToDisplay = paginate(items, 0, 5);
      expect(itemsToDisplay).toEqual(_.range(0, 5));
    });

    it('should display items 30 through 34', function() {
      const itemsToDisplay = paginate(items, 6, 5);
      expect(itemsToDisplay).toEqual(_.range(30, 35));
    });

    it('should display the last 5 items', function() {
      const itemsToDisplay = paginate(items, 19, 5);
      expect(itemsToDisplay).toEqual(_.range(95, 99));
    });
  });
});
