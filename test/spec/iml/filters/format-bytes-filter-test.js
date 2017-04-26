import filterModule from '../../../../source/iml/filters/filters-module';
import { formatBytes } from '@mfl/number-formatters';

describe('format bytes filter', () => {
  let fmtBytesFilter;

  beforeEach(module(filterModule));

  beforeEach(
    inject(_fmtBytesFilter_ => {
      fmtBytesFilter = _fmtBytesFilter_;
    })
  );

  it('should be format bytes', () => {
    expect(fmtBytesFilter).toBe(formatBytes);
  });
});
