// @flow

//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import * as parsely from 'intel-parsely';

import * as fp from 'intel-fp';

import { and } from 'intel-qs-parsers/input-to-qs-parser.js';

import type { tokensToResult, result } from 'intel-parsely';

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

export default (tokenizer: Function, parser: tokensToResult) => {
  return fp.memoize(
    fp.flow(tokenizer, parsely.sepByInfinity(parser, and), ({
      result
    }: result) => {
      if (typeof result === 'string') {
        return [];
      } else {
        const {
          start,
          end
        } = result;

        return result.expected
          .reduce(
            (arr, x) => {
              return arr.concat(lookup[x] || x);
            },
            []
          )
          .filter(x => blacklist.indexOf(x) === -1)
          .map(x => ({
            start,
            end,
            suggestion: x
          }));
      }
    })
  );
};
