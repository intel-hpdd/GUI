import logInputToQsParser from '../../../../source/iml/logs/log-input-to-qs-parser.js';

describe('the log input to qs parser', () => {
  const inputOutput = {
    '': '',
    a: new Error('Expected one of type, service, message, host, offset, limit, date, order by got a at character 0'),
    'type = ': new Error('Expected one of normal, lustre, lustre_error, copytool, copytool_error got end of string'),
    'type = [1,2,3]': new Error(
      'Expected one of normal, lustre, lustre_error, copytool, copytool_error got [ at character 7'
    ),
    'offset = ': new Error('Expected number got end of string'),
    'type in 3': new Error('Expected [ got 3 at character 8'),
    'service=cluster_sim': 'tag=cluster_sim',
    'type in [normal,lustre,copytool]': 'message_class__in=NORMAL,LUSTRE,COPYTOOL',
    'order by date asc': 'order_by=datetime',
    'order by date desc': 'order_by=-datetime',
    'type = lustre_error and service in [cluster_sim] and offset = 10':
      'message_class=LUSTRE_ERROR&tag__in=cluster_sim&offset=10'
  };

  Object.keys(inputOutput).forEach(input => {
    let output = inputOutput[input];

    if (output instanceof Error) output = output.message;

    it('should parse ' + (input || ' empty input ') + ' to ' + output, () => {
      let result = logInputToQsParser(input);

      if (result instanceof Error) result = result.message;

      expect(result).toBe(output);
    });
  });
});
