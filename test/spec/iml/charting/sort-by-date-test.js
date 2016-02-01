import highland from 'highland';
import chartingModule from '../../../../source/iml/charting/charting-module';

describe('the sort by date plugin', function () {
  beforeEach(module(chartingModule));

  var sortByDate, spy;

  beforeEach(inject(function (_sortByDate_) {
    sortByDate = _sortByDate_;
    spy = jasmine.createSpy('spy');
  }));

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
