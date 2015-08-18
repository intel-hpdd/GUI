describe('the remove dups plugin', function () {
  'use strict';

  beforeEach(module('charting'));

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
