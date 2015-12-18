describe('format bytes filter', function () {
  'use strict';

  var formatBytes;

  beforeEach(window.module('filters', function ($provide) {
    formatBytes = {};

    $provide.value('formatBytes', formatBytes);
  }));

  var fmtBytesFilter;

  beforeEach(inject(function (_fmtBytesFilter_) {
    fmtBytesFilter = _fmtBytesFilter_;
  }));

  it('should be format bytes', function () {
    expect(fmtBytesFilter).toBe(formatBytes);
  });
});
