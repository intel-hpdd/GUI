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
import * as inputToQsParser from 'intel-qs-parsers/input-to-qs-parser.js';
import * as parsely from 'intel-parsely';

import { inputToQsTokens } from 'intel-qs-parsers/tokens.js';

import type { tokensToResult } from 'intel-parsely';

export const tokenizer = parsely.getLexer(inputToQsTokens);

// type parser
const type = parsely.matchValueTo('type', 'message_class');
const types = parsely.choice(
  ['normal', 'lustre', 'lustre_error', 'copytool', 'copytool_error'].map(type =>
    fp.flow(parsely.matchValue(type), parsely.onSuccess(x => x.toUpperCase())))
);
const typeParser = parsely.choice([
  inputToQsParser.assign(type, types),
  inputToQsParser.inList(type, types)
]);

//service parser
const service = parsely.matchValueTo('service', 'tag');
const assign: tokensToResult = inputToQsParser.assign(
  service,
  inputToQsParser.value
);
const inList: tokensToResult = inputToQsParser.inList(
  service,
  inputToQsParser.value
);
const serviceParser = parsely.choice([inList, assign]);

//message parser
const message = parsely.matchValue('message');
const messageLike = inputToQsParser.like(message, inputToQsParser.value);

// date parser
const date = parsely.matchValueTo('date', 'datetime');

const rightHand = fp.flow(
  parsely.parseStr([date, inputToQsParser.ascOrDesc]),
  parsely.onSuccess(x => x.split('-').reverse().join('-'))
);

// hostname parser
const host = parsely.matchValueTo('host', 'fqdn');
const hostName = parsely.many1(
  parsely.choice([
    inputToQsParser.value,
    inputToQsParser.number,
    inputToQsParser.dot,
    inputToQsParser.dash
  ])
);
const hostAssign = inputToQsParser.assign(host, hostName);
const hostStarts = inputToQsParser.starts(host, hostName);
const hostParser = parsely.choice([hostAssign, hostStarts]);

const orderByParser = parsely.parseStr([inputToQsParser.orderBy, rightHand]);

export const choices = parsely.choice([
  typeParser,
  serviceParser,
  messageLike,
  hostParser,
  inputToQsParser.offsetParser,
  inputToQsParser.limitParser,
  inputToQsParser.dateParser(date),
  orderByParser
]);

const expr = parsely.sepBy1(choices, inputToQsParser.and);
const emptyOrExpr = parsely.optional(expr);
const logParser = parsely.parseStr([emptyOrExpr, parsely.endOfString]);

export default fp.memoize(fp.flow(tokenizer, logParser, x => x.result));
