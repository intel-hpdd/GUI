import extractApiFilterModule
  from '../../../../source/iml/extract-api-filter/extract-api-filter-module.js';

describe('extract api filter', () => {
  let extractApiFilter;

  beforeEach(module(extractApiFilterModule));

  beforeEach(
    inject($filter => {
      extractApiFilter = $filter('extractApi');
    })
  );

  it('should extract the id', () => {
    expect(extractApiFilter('/api/host/1')).toBe('1');
  });
});
