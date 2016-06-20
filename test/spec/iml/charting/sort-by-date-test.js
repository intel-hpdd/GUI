import highland from 'highland';
import sortByDate from '../../../../source/iml/charting/sort-by-date.js';

describe('the sort by date plugin', function () {
  var spy;

  beforeEach(() => {
    spy = jasmine.createSpy('spy');
  });

  it('should sort items by date', function () {
    highland([
      { ts: '2015-05-10T23:51:50.000Z' },
      { ts: '2015-05-10T23:50:50.000Z' }
    ])
      .through(sortByDate)
      .collect()
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith([
      { ts: '2015-05-10T23:50:50.000Z' },
      { ts: '2015-05-10T23:51:50.000Z' }
    ]);
  });
});
