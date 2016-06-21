import {
  tokenizer,
  choices
} from '../../../../source/iml/status/status-input-to-qs-parser.js';

import completer from '../../../../source/iml/completionist/completer.js';

describe('completer', () => {
  let statusCompleter;

  beforeEach(() => {
    statusCompleter = completer(tokenizer, choices);
  });

  const inputOutput = {
    '': [
      { start: Infinity, end: Infinity, suggestion: 'severity' },
      { start: Infinity, end: Infinity, suggestion: 'type' },
      { start: Infinity, end: Infinity, suggestion: 'offset' },
      { start: Infinity, end: Infinity, suggestion: 'limit' },
      { start: Infinity, end: Infinity, suggestion: 'order by' },
      { start: Infinity, end: Infinity, suggestion: 'begin' },
      { start: Infinity, end: Infinity, suggestion: 'end' }
    ],
    'a': [
      { start: 0, end: 1, suggestion: 'severity' },
      { start: 0, end: 1, suggestion: 'type' },
      { start: 0, end: 1, suggestion: 'offset' },
      { start: 0, end: 1, suggestion: 'limit' },
      { start: 0, end: 1, suggestion: 'order by' },
      { start: 0, end: 1, suggestion: 'begin' },
      { start: 0, end: 1, suggestion: 'end' }
    ],
    'severity = ': [
      { start: Infinity, end: Infinity, suggestion: 'info' },
      { start: Infinity, end: Infinity, suggestion: 'debug' },
      { start: Infinity, end: Infinity, suggestion: 'critical' },
      { start: Infinity, end: Infinity, suggestion: 'warning' },
      { start: Infinity, end: Infinity, suggestion: 'error' }
    ],
    'offset = ': [],
    'severity = [1,2,3]': [
      { start: 11, end: 12, suggestion: 'info' },
      { start: 11, end: 12, suggestion: 'debug' },
      { start: 11, end: 12, suggestion: 'critical' },
      { start: 11, end: 12, suggestion: 'warning' },
      { start: 11, end: 12, suggestion: 'error' }
    ],
    'type in 3': [
      { start: 8, end: 9, suggestion: '[' }
    ],
    'type=AlertEvent': [
      { start: Infinity, end: Infinity, suggestion: 'and' }
    ],
    'severity in [warning,error,critical]': [
      { start: Infinity, end: Infinity, suggestion: 'and' }
    ],
    'order by begin asc': [
      { start: Infinity, end: Infinity, suggestion: 'and' }
    ],
    'order by end desc': [
      { start: Infinity, end: Infinity, suggestion: 'and' }
    ],
    'type = LNetOfflineAlert and severity in [info] and offset = 10': [
      { start: Infinity, end: Infinity, suggestion: 'and' }
    ]
  };

  Object.keys(inputOutput).forEach(input => {
    var output = inputOutput[input];

    if (output instanceof Error)
      output = output.message;

    it(`should parse ${input || 'empty input'}`, () => {
      var result = statusCompleter(input);

      if (result instanceof Error)
        result = result.message;

      expect(result).toEqual(output);
    });
  });
});
