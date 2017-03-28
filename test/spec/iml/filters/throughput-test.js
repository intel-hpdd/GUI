import filterModule from '../../../../source/iml/filters/filters-module';

describe('Throughput Filter', () => {
  let throughput;

  beforeEach(module(filterModule));

  beforeEach(
    inject(function($filter) {
      throughput = $filter('throughput');
    })
  );

  const tests = [
    { input: 1000, expected: '1000 B/s' },
    { input: 1000, bps: true, expected: '7.813 kb/s' },
    { input: 3045827469, expected: '2.837 GB/s' },
    { input: 3045827469, bps: true, expected: '22.69 Gb/s' },
    { input: NaN, expected: '' },
    { input: 'quack', expected: '' }
  ];

  tests.forEach(function runTest(test) {
    it(getDescription(test.input, test.expected), function expectFormat() {
      const result = throughput(test.input, test.bps);

      expect(test.expected).toEqual(result);
    });
  });

  function getDescription(input, expected) {
    return `should convert ${input} to ${expected}`;
  }
});
