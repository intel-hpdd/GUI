import filterModule from '../../../../source/iml/filters/filters-module';

describe('format bytes filter', () => {
  var formatBytes;

  beforeEach(module(filterModule, $provide => {
    formatBytes = {};

    $provide.value('formatBytes', formatBytes);
  }));

  var fmtBytesFilter;

  beforeEach(inject(_fmtBytesFilter_ => {
    fmtBytesFilter = _fmtBytesFilter_;
  }));

  it('should be format bytes', () => {
    expect(fmtBytesFilter).toBe(formatBytes);
  });
});
