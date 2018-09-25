// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as parsely from "@iml/parsely";

import * as fp from "@iml/fp";

import { and } from "@iml/qs-parsers/source/input-to-qs-parser.js";

import type { tokensToResult, Result } from "@iml/parsely";

const blacklist = [
  "value",
  "number",
  ".",
  "-",
  "four digit year",
  "two digit month between 1 and 12",
  "two digit day between 1 and 31",
  "two digit hour between 1 and 23",
  "two digit minute between 00 and 59",
  "two digit second between 00 and 59"
];

const lookup = {
  "]": [",", "]"]
};

export default (tokenizer: Function, parser: tokensToResult) => {
  return fp.memoize(
    fp.flow(
      tokenizer,
      parsely.sepByInfinity(parser)(and),
      ({ result }: Result) => {
        if (typeof result === "string") {
          return [];
        } else {
          const { start, end } = result;

          return result.expected
            .reduce((arr, x) => {
              return arr.concat(lookup[x] || x);
            }, [])
            .filter(x => blacklist.indexOf(x) === -1)
            .map(x => ({
              start,
              end,
              suggestion: x
            }));
        }
      }
    )
  );
};
