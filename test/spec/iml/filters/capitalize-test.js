import angular from '../../../angular-mock-setup.js';
import filterModule from '../../../../source/iml/filters/filters-module';

describe('Capitalize Filter', () => {
  let capitalize;

  beforeEach(angular.mock.module(filterModule));

  beforeEach(
    angular.mock.inject($filter => {
      capitalize = $filter('capitalize');
    })
  );

  const tests = [
    { input: 'foo', expected: 'Foo', expectedAll: 'Foo' },
    { input: 'foo bar', expected: 'Foo bar', expectedAll: 'Foo Bar' },
    { input: 'foo', expected: 'Foo', expectedAll: 'Foo' },
    { input: 5, expected: 5, expectedAll: 5 },
    { input: 'BAZ', expected: 'BAZ', expectedAll: 'BAZ' }
  ];

  tests.forEach(function runTest(test) {
    it(getDescription(test.input, test.expected), function expectFirst() {
      const result = capitalize(test.input);

      expect(test.expected).toEqual(result);
    });

    it(getDescription(test.input, test.expected, true), function expectAll() {
      const result = capitalize(test.input, true);

      expect(test.expectedAll).toEqual(result);
    });
  });

  function getDescription(input, expected, isAll) {
    const description = `should convert ${input} to ${expected}`;
    const allDescription = description + 'using all';

    return isAll ? allDescription : description;
  }
});
