import {flow, memoize} from 'intel-fp';
import {and} from 'intel-qs-parsers/input-to-qs-parser.js';
import {tokenizer, choices} from './status-input-to-qs-parser.js';
import * as parsely from 'intel-parsely';

const blacklist = [
  'value',
  'number',
  'four digit year',
  'two digit month between 1 and 12',
  'two digit day between 1 and 31',
  'two digit hour between 1 and 23',
  'two digit minute between 00 and 59',
  'two digit second between 00 and 59'
];

const lookup = {
  ']': [',', ']']
};

export default memoize(
  flow(
    tokenizer,
    parsely.sepByInfinity(choices, and),
    parsely.onSuccess(() => []),
    parsely.onError(e => {
      return e.expected
        .reduce((arr, x) => {
          return arr.concat(lookup[x] || x);
        }, [])
        .filter(x => blacklist.indexOf(x) === -1)
        .map(x => ({
          start: e.start,
          end: e.end,
          suggestion: x
        }));
    }),
    x => x.result
  )
);
