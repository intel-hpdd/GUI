describe('qs to input parser test', function () {
  var configs;

  beforeEach(module(function () {
    configs = angular.module('statusModule')._configBlocks;
    angular.module('statusModule')._configBlocks = [];
  }, 'statusModule'));

  afterEach(function () {
    angular.module('statusModule')._configBlocks = configs;
  });


  var qsToInputParser;

  beforeEach(inject(function (_qsToInputParser_) {
    qsToInputParser = _qsToInputParser_;
  }));

  var inputOutput = {
    '': '',
    'a': new Error('Expected in got end of string'),
    'a= ': new Error('Expected value got end of string'),
    'a b': new Error('Expected in got value at character 2'),
    'a = 1,2,3': new Error('Expected end of string got sep'),
    'a=1&b=2': 'a = 1 and b = 2',
    'a=b': 'a = b',
    'a__in=1,2,3': 'a in [1,2,3]',
    'a=b&c=d&x__in=1': 'a = b and c = d and x in [1]',
    'a__in=2&b__in=3,4,5': 'a in [2] and b in [3,4,5]'
  };

  Object.keys(inputOutput).forEach(function check (input) {
    var output = inputOutput[input];

    if (output instanceof Error)
      output = output.message;

    it('should parse ' + (input || ' empty input ') + ' to ' + output, function () {
      var result = qsToInputParser(input);

      if (result instanceof Error)
        result = result.message;

      expect(result).toBe(output);
    });
  });
});
