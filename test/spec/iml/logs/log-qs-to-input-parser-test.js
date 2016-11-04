import logQsToInputParser from '../../../../source/iml/logs/log-qs-to-input-parser.js';

describe('log qs to input parser test', () => {
  const inputOutput = {
    '': '',
    'a': new Error(
      'Expected one of __contains, __startswith, __endswith, __in, __gte, __lte, __gt, __lt, = got end of string'
    ),
    'a=':
      new Error(
        'Expected one of four digit year, NORMAL, LUSTRE, LUSTRE_ERROR, COPYTOOL, COPYTOOL_ERROR, ., -, value, number got end of string'
      ),
    'a__in=': new Error(
      'Expected one of NORMAL, LUSTRE, LUSTRE_ERROR, COPYTOOL, COPYTOOL_ERROR, ., -, value, number got end of string'
    ),
    'a__in==': new Error(
      'Expected one of NORMAL, LUSTRE, LUSTRE_ERROR, COPYTOOL, COPYTOOL_ERROR, ., -, value, number got = at character 6'
    ),
    '__in': new Error('Expected one of datetime, tag, message_class, fqdn, value, order_by got __in at character 0'),
    'a&': new Error('Expected one of __contains, __startswith, __endswith, __in, __gte, __lte, __gt, __lt, = got & at character 1'),
    'a=b&&': new Error('Expected one of datetime, tag, message_class, fqdn, value, order_by got & at character 4'),
    'a__in=b&&': new Error(
      'Expected one of datetime, tag, message_class, fqdn, value, order_by got & at character 8'
    ),
    'a=1&b__contains=foo': 'a = 1 and b contains foo',
    'a=1&b=2': 'a = 1 and b = 2',
    'a=b': 'a = b',
    'a__in=1%2C2%2C3': 'a in [1, 2, 3]',
    'a=b&c=d&x__in=1': 'a = b and c = d and x in [1]',
    'a__in=2&b__in=3%2C4%2C5': 'a in [2] and b in [3, 4, 5]',
    'b__in=1&a__in=2&b__in=3%2C4%2C5': 'b in [1] and a in [2] and b in [3, 4, 5]',
    'b__in=1&c=1': 'b in [1] and c = 1',
    'b__in=1&c=1&a__in=2&b__in=3%2C4%2C5&e=4&x__endswith=9':
      'b in [1] and c = 1 and a in [2] and b in [3, 4, 5] and e = 4 and x ends with 9',
    'datetime=3': 'date = 3',
    'tag=cluster_sim': 'service = cluster_sim',
    'message_class=NORMAL': 'type = normal'
  };

  Object.keys(inputOutput).forEach(input => {
    let output = inputOutput[input];

    if (output instanceof Error)
      output = output.message;

    it('should parse ' + (input || ' empty input ') + ' to ' + output, function () {
      let result = logQsToInputParser(input);

      if (result instanceof Error)
        result = result.message;

      expect(result).toBe(output);
    });
  });
});
