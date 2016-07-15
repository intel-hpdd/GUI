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

import {flow, memoize} from 'intel-fp';
import * as inputToQsParser from 'intel-qs-parsers/input-to-qs-parser.js';
import * as parsely from 'intel-parsely';
import {inputToQsTokens} from 'intel-qs-parsers/tokens.js';
import type {tokensToResult} from 'intel-parsely';

export const tokenizer = parsely.getLexer(inputToQsTokens);

const severity = parsely.matchValue('severity');

// severity parser
const severities = parsely.choice(
[
  'info',
  'debug',
  'critical',
  'warning',
  'error'
]
  .map(
    severity => flow(
      parsely.matchValue(severity),
      parsely.onSuccess(x => x.toUpperCase())
    )
  )
);

const assignSeverity = inputToQsParser.assign(severity, severities);
const inListSeverity = inputToQsParser.inList(severity, severities);
const severityParser = parsely.choice([
  inListSeverity,
  assignSeverity
]);

// type parser
const type = parsely.matchValueTo('type', 'record_type');
const assign:tokensToResult = inputToQsParser.assign(type, inputToQsParser.value);
const like:tokensToResult =  inputToQsParser.like(type, inputToQsParser.value);
const ends:tokensToResult = inputToQsParser.ends(type, inputToQsParser.value);
const inList:tokensToResult = inputToQsParser.inList(type, inputToQsParser.value);
const typeParser = parsely.choice([
  inList,
  like,
  ends,
  assign
]);

const begin = parsely.matchValue('begin');
const end = parsely.matchValue('end');
const beginOrEnd = parsely.choice([begin, end]);

const rightHand = flow(
  parsely.parseStr([
    beginOrEnd,
    inputToQsParser.ascOrDesc
  ]),
  parsely.onSuccess(x => x.split('-').reverse().join('-'))
);

const orderByParser = parsely.parseStr([
  inputToQsParser.orderBy,
  rightHand
]);

// active parser
const active = parsely.matchValue('active');
const t = parsely.matchValue('true');
const f = parsely.matchValueTo('false', 'none');
const activeParser = inputToQsParser.assign(
  active,
  parsely.choice([
    t,
    f
  ])
);

export const choices = parsely.choice([
  severityParser,
  typeParser,
  activeParser,
  inputToQsParser.offsetParser,
  inputToQsParser.limitParser,
  orderByParser,
  inputToQsParser.dateParser(beginOrEnd)
]);
const expr = parsely.sepBy1(choices, inputToQsParser.and);
const emptyOrExpr = parsely.optional(expr);
const statusParser = parsely.parseStr([emptyOrExpr, parsely.endOfString]);


export default memoize(flow(
  tokenizer,
  statusParser,
  x => x.result
));
