import qsToOldQsParser from '../../../../source/iml/qs-to-old-qs-parser/qs-to-old-qs-parser';

describe('qs to old qs parser', () => {
  const inputOutput = {
    'a=1&b__contains=foo': 'a=1&b__contains=foo',
    'a=1&b=2': 'a=1&b=2',
    'a=b': 'a=b',
    'a__in=1,2,3': 'a__in=1&a__in=2&a__in=3',
    'a=b&c=d&x__in=1': 'a=b&c=d&x__in=1',
    'a__in=2&b__in=3,4,5': 'a__in=2&b__in=3&b__in=4&b__in=5',
    'b__in=1&a__in=2&b__in=3,4,5': 'b__in=1&a__in=2&b__in=3&b__in=4&b__in=5',
    'b__in=1&c=1': 'b__in=1&c=1',
    'b__in=1&c=1&a__in=2&b__in=3,4,5&e=4&x__endswith=9':
      'b__in=1&c=1&a__in=2&b__in=3&b__in=4&b__in=5&e=4&x__endswith=9'
  };

  Object.keys(inputOutput).forEach(input => {
    let output = inputOutput[input];

    if (output instanceof Error)
      output = output.message;

    it(`should parse ${(input || ' empty input ')}  to ${output}`, () => {
      let result = qsToOldQsParser(input);

      if (result instanceof Error)
        result = result.message;

      expect(result).toBe(output);
    });
  });
});
