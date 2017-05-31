// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as parsely from 'intel-parsely';

import * as fp from 'intel-fp';

import {
  and
} from 'intel-qs-parsers/input-to-qs-parser.js';

import type {
  tokensToResult
} from 'intel-parsely';

const blacklist = [
  'value',
  'number',
  '.',
  '-',
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

export default (tokenizer:Function, parser:tokensToResult) => {
  return fp.memoize(
    fp.flow(
      tokenizer,
      parsely.sepByInfinity(parser, and),
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
};
