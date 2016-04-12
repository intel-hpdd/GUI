import toDateFilterModule from '../../../../source/iml/to-date-filter/to-date-filter-module.js';

describe('to date filter', () => {
  var toDate, result;
  beforeEach(module(toDateFilterModule));

  beforeEach(inject(function ($filter) {
    toDate = $filter('toDate');

    result = toDate(1460492750371);
  }));

  it('should return the date object', () => {
    expect(result).toEqual(new Date(1460492750371));
  });
});
