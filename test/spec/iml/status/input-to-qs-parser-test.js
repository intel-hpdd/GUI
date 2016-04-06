import statusModule from '../../../../source/iml/status/status-module';


describe('the input to qs parser', () => {
  beforeEach(module(statusModule));

  var statusInputToQsParser;

  beforeEach(inject(_statusInputToQsParser_ => {
    statusInputToQsParser = _statusInputToQsParser_;
  }));

  var inputOutput = {
    '': '',
    'a': new Error('Expected equals got end of string'),
    'a = ': new Error('Expected value got end of string'),
    'a b': new Error('Expected equals got value at character 2'),
    'a = [1,2,3]': new Error('Expected value got startList at character 4'),
    'a in 3': new Error('Expected startList got value at character 5'),
    'a=b': 'a=b',
    'a in [1,2,3]': 'a__in=1,2,3',
    'a = b and c = d and x in [1]': 'a=b&c=d&x__in=1'
  };

  Object.keys(inputOutput).forEach(input => {
    var output = inputOutput[input];

    if (output instanceof Error)
      output = output.message;

    it('should parse ' + (input || ' empty input ') + ' to ' + output, function () {
      var result = statusInputToQsParser(input);

      if (result instanceof Error)
        result = result.message;

      expect(result).toBe(output);
    });
  });
});
