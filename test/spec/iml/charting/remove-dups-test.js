import highland from 'highland';
import chartingModule from '../../../../source/iml/charting/charting-module';

describe('the remove dups plugin', function () {

  beforeEach(module(chartingModule));

  var removeDups, spy;

  beforeEach(inject(function (_removeDups_) {
    removeDups = _removeDups_;
    spy = jasmine.createSpy('spy');
  }));

  it('should remove dups', function () {
    highland([
      { ts: 1 },
      { ts: 2 },
      { ts: 1 }
    ])
      .through(removeDups)
      .collect()
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith([
      { ts: 1 },
      { ts: 2 }
    ]);
  });
});
