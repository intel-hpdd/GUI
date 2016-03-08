import filterModule from '../../../../source/iml/filters/filters-module';

describe('Capitalize Filter', () => {
  var capitalize;

  beforeEach(module(filterModule));

  beforeEach(inject(function ($filter) {
    capitalize = $filter('capitalize');
  }));

  var tests = [
    {input: 'foo', expected: 'Foo', expectedAll: 'Foo'},
    {input: 'foo bar', expected: 'Foo bar', expectedAll: 'Foo Bar'},
    {input: 'foo', expected: 'Foo', expectedAll: 'Foo'},
    {input: 5, expected: 5, expectedAll: 5},
    {input: 'BAZ', expected: 'BAZ', expectedAll: 'BAZ'}
  ];

  tests.forEach(function runTest (test) {
    it(getDescription(test.input, test.expected), function expectFirst () {
      var result = capitalize(test.input);

      expect(test.expected).toEqual(result);
    });

    it(getDescription(test.input, test.expected, true), function expectAll () {
      var result = capitalize(test.input, true);

      expect(test.expectedAll).toEqual(result);
    });
  });

  function getDescription (input, expected, isAll) {
    var description = `should convert ${input} to ${expected}`;
    var allDescription = description + 'using all';

    return isAll ? allDescription : description;
  }
});