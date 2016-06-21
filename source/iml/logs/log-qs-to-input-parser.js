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

import * as fp from 'intel-fp';
import * as qsToInputParser from 'intel-qs-parsers/qs-to-input-parser.js';
import * as parsely from 'intel-parsely';

import {
  qsToInputTokens
} from 'intel-qs-parsers/tokens.js';

const tokenizer = parsely.getLexer(qsToInputTokens);

const leftHands = parsely.choice([
  parsely.matchValueTo('datetime', 'date'),
  parsely.matchValueTo('tag', 'service'),
  parsely.matchValueTo('message_class', 'type'),
  parsely.matchValueTo('fqdn', 'host'),
  qsToInputParser.value
]);

const valueOrNumberOrDotOrDash = parsely.choice([
  qsToInputParser.dot,
  qsToInputParser.dash,
  qsToInputParser.value,
  qsToInputParser.number
]);


const rightHands = parsely.choice(
  [
    'NORMAL',
    'LUSTRE',
    'LUSTRE_ERROR',
    'COPYTOOL',
    'COPYTOOL_ERROR'
  ]
  .map(
    severity => fp.flow(
      parsely.matchValue(severity),
      parsely.onSuccess(x => x.toLowerCase())
    )
  )
  .concat(
    parsely.many1(valueOrNumberOrDotOrDash)
  )
);

const assign = qsToInputParser.assign(leftHands, rightHands);
const like = qsToInputParser.like(leftHands, rightHands);
const starts = qsToInputParser.starts(leftHands,rightHands);
const ends = qsToInputParser.ends(leftHands,rightHands);
const inList = qsToInputParser.inList(leftHands, rightHands);
const date = qsToInputParser.dateParser(leftHands);
const orderBy = qsToInputParser.orderByParser(leftHands);
const choices = parsely.choice([
  like,
  starts,
  ends,
  inList,
  date,
  assign,
  orderBy
]);
const expr = parsely.sepBy1(
  choices,
  qsToInputParser.and
);
const emptyOrExpr = parsely.optional(expr);
const logParser = parsely.parseStr([
  emptyOrExpr,
  parsely.endOfString
]);

export default fp.memoize(
  fp.flow(
    tokenizer,
    logParser,
    x => x.result
  )
);
