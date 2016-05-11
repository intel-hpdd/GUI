import statusModule from '../../../../source/iml/status/status-module';


describe('status qs to input parser test', () => {
  beforeEach(module(statusModule));

  var statusQsToInputParser;

  beforeEach(inject(_statusQsToInputParser_ => {
    statusQsToInputParser = _statusQsToInputParser_;
  }));

  const inputOutput = {
    '': '',
    'a': new Error('Expected one of __contains, __endswith, __in, __gte, __lte, __gt, __lt, = got end of string'),
    'a=':
      new Error(
        'Expected one of four digit year, INFO, DEBUG, CRITICAL, WARNING, ERROR, value, number got end of string'
      ),
    'a__in=': new Error('Expected one of INFO, DEBUG, CRITICAL, WARNING, ERROR, value, number got end of string'),
    'a__in==': new Error('Expected one of INFO, DEBUG, CRITICAL, WARNING, ERROR, value, number got = at character 6'),
    '__in': new Error('Expected one of severity, record_type, value, order_by got __in at character 0'),
    'a&': new Error('Expected one of __contains, __endswith, __in, __gte, __lte, __gt, __lt, = got & at character 1'),
    'a=b&&': new Error('Expected one of severity, record_type, value, order_by got & at character 4'),
    'a__in=b&&': new Error('Expected one of severity, record_type, value, order_by got & at character 8'),
    'a=1&b__contains=foo': 'a = 1 and b contains foo',
    'a=1&b=2': 'a = 1 and b = 2',
    'a=b': 'a = b',
    'a__in=1,2,3': 'a in [1, 2, 3]',
    'a=b&c=d&x__in=1': 'a = b and c = d and x in [1]',
    'a__in=2&b__in=3,4,5': 'a in [2] and b in [3, 4, 5]',
    'b__in=1&a__in=2&b__in=3,4,5': 'b in [1] and a in [2] and b in [3, 4, 5]',
    'b__in=1&c=1': 'b in [1] and c = 1',
    'b__in=1&c=1&a__in=2&b__in=3,4,5&e=4&x__endswith=9':
      'b in [1] and c = 1 and a in [2] and b in [3, 4, 5] and e = 4 and x ends with 9'
  };

  Object.keys(inputOutput).forEach(input => {
    var output = inputOutput[input];

    if (output instanceof Error)
      output = output.message;

    it('should parse ' + (input || ' empty input ') + ' to ' + output, function () {
      var result = statusQsToInputParser(input);

      if (result instanceof Error)
        result = result.message;

      expect(result).toBe(output);
    });
  });
});
