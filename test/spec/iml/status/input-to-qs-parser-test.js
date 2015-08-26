describe('the input to qs parser', function () {
  'use strict';

  beforeEach(module('statusModule'));

  var inputToQsParser;

  beforeEach(inject(function (_inputToQsParser_) {
    inputToQsParser = _inputToQsParser_;
  }));

  var inputOutput = {
    '': '',
    'a': new Error('Expected in got end of string'),
    'a = ': new Error('Expected value got end of string'),
    'a b': new Error('Expected in got value at character 2'),
    'a = [1,2,3]': new Error('Expected value got startList at character 4'),
    'a in 3': new Error('Expected startList got value at character 5'),
    'a=b': 'a=b',
    'a in [1,2,3]': 'a__in=1&a__in=2&a__in=3',
    'a = b and c = d and x in [1]': 'a=b&c=d&x__in=1'
  };

  Object.keys(inputOutput).forEach(function check (input) {
    var output = inputOutput[input];

    if (output instanceof Error)
      output = output.message;

    it('should parse ' + (input || ' empty input ') + ' to ' + output, function () {
      var result = inputToQsParser(input);

      if (result instanceof Error)
        result = result.message;

      expect(result).toBe(output);
    });
  });
});
