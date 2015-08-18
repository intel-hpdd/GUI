describe('the remove dups plugin', function () {
  'use strict';

  beforeEach(module('charting'));

  var removeDupsBy, spy;

  beforeEach(inject(function (_removeDupsBy_) {
    removeDupsBy = _removeDupsBy_;
    spy = jasmine.createSpy('spy');
  }));

  it('should remove dups by a comparator and timestamp', function () {
    highland([
      { ts: 1, x: 1 },
      { ts: 2, x: 3 },
      { ts: 1, x: 2 },
      { ts: 1, x: 1 }
    ])
      .through(removeDupsBy(_.eqProp('x')))
      .collect()
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith([
      { ts: 1, x: 1 },
      { ts: 2, x: 3 },
      { ts: 1, x: 2 }
    ]);
  });
});
