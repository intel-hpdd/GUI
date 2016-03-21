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

import {always, lensProp, flow, view} from 'intel-fp';
import * as parsely from 'intel-parsely';

export default function statusParserFactory (): Function {
  'ngInject';

  const tokenizer = parsely.getLexer([
    parsely.getLexer.whiteSpace,
    {
      name: 'join',
      pattern: /^and/
    },
    {
      name: 'in',
      pattern: /^in/
    },
    {
      name: 'contains',
      pattern: /^contains/
    },
    {
      name: 'ends with',
      pattern: /^ends with/
    },
    {
      name: 'value',
      pattern: /^[a-zA-Z_\d]+/
    },
    {
      name: 'equals',
      pattern: /^=/
    },
    {
      name: 'startList',
      pattern: /^\[/
    },
    {
      name: 'endList',
      pattern: /^]/
    },
    {
      name: 'sep',
      pattern: /^,/
    }
  ]);

  const parseToStr = parsely.parse(always(''));
  const value = parsely.token('value', view(lensProp('content')));
  const equals = parsely.token('equals', always('='));
  const contains = parsely.token('contains', always('__contains='));
  const endsWith = parsely.token('ends with', always('__endswith='));
  const inToken = parsely.token('in', always('__in='));
  const startList = parsely.token('startList', always(''));
  const endList = parsely.token('endList', always(''));
  const sep = parsely.token('sep', always(','));
  const join = parsely.token('join', always('&'));
  const valueSep = parsely.sepBy1(value, sep);
  const assign = parseToStr([value, equals, value]);
  const like = parseToStr([value, contains, value]);
  const ends = parseToStr([value, endsWith, value]);
  const list = parseToStr([startList, valueSep, endList]);
  const inList = parseToStr([value, inToken, list]);
  const assignOrIn = parsely.choice([inList, like, ends, assign]);
  const expr = parsely.sepBy1(assignOrIn, join);
  const emptyOrExpr = parsely.optional(expr);
  const statusParser = parseToStr([emptyOrExpr, parsely.endOfString]);

  return flow(tokenizer, statusParser, x => x.result);
}
