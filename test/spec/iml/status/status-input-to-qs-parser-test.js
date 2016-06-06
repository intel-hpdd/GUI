import statusModule from '../../../../source/iml/status/status-module';


describe('the status input to qs parser', () => {
  beforeEach(module(statusModule));

  var statusInputToQsParser;

  beforeEach(inject(_statusInputToQsParser_ => {
    statusInputToQsParser = _statusInputToQsParser_;
  }));

  var inputOutput = {
    '': '',
    'a': new Error('Expected one of severity, type, offset, limit, order by, begin, end got a at character 0'),
    'severity = ': new Error('Expected one of info, debug, critical, warning, error got end of string'),
    'offset = ': new Error('Expected number got end of string'),
    'severity = [1,2,3]': new Error('Expected one of info, debug, critical, warning, error got [ at character 11'),
    'type in 3': new Error('Expected [ got 3 at character 8'),
    'type=AlertEvent': 'record_type=AlertEvent',
    'severity in [warning,error,critical]': 'severity__in=WARNING,ERROR,CRITICAL',
    'order by begin asc': 'order_by=begin',
    'order by end desc': 'order_by=-end',
    'type = LNetOfflineAlert and severity in [info] and offset = 10':
      'record_type=LNetOfflineAlert&severity__in=INFO&offset=10'
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