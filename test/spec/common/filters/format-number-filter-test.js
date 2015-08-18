describe('format number filter', function () {
  'use strict';

  var formatNumber;

  beforeEach(module('filters', function ($provide) {
    formatNumber = {};

    $provide.value('formatNumber', formatNumber);
  }));

  var fmtNumberFilter;

  beforeEach(inject(function (_fmtNumberFilter_) {
    fmtNumberFilter = _fmtNumberFilter_;
  }));

  it('should be format number', function () {
    expect(fmtNumberFilter).toBe(formatNumber);
  });
});
