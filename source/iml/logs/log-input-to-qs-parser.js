// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';
import * as inputToQsParser from '@iml/qs-parsers/source/input-to-qs-parser.js';
import * as parsely from '@iml/parsely';

import { inputToQsTokens } from '@iml/qs-parsers/source/tokens.js';

import type { tokensToResult } from '@iml/parsely';

export const tokenizer = parsely.getLexer(inputToQsTokens);

// type parser
const type = parsely.matchValueTo('type', 'message_class');
const types = parsely.choice(
  ['normal', 'lustre', 'lustre_error', 'copytool', 'copytool_error'].map(type =>
    fp.flow(
      parsely.matchValue(type),
      parsely.onSuccess(x => x.toUpperCase())
    )
  )
);
const typeParser = parsely.choice([inputToQsParser.assign(type, types), inputToQsParser.inList(type, types)]);

//service parser
const service = parsely.matchValueTo('service', 'tag');
const assign: tokensToResult = inputToQsParser.assign(service, inputToQsParser.value);
const inList: tokensToResult = inputToQsParser.inList(service, inputToQsParser.value);
const serviceParser = parsely.choice([inList, assign]);

//message parser
const message = parsely.matchValue('message');
const messageLike = inputToQsParser.like(message, inputToQsParser.value);

// date parser
const date = parsely.matchValueTo('date', 'datetime');

const rightHand = fp.flow(
  parsely.parseStr([date, inputToQsParser.ascOrDesc]),
  parsely.onSuccess(x =>
    x
      .split('-')
      .reverse()
      .join('-')
  )
);

// hostname parser
const host = parsely.matchValueTo('host', 'fqdn');
const hostName = parsely.many1(
  parsely.choice([inputToQsParser.value, inputToQsParser.number, inputToQsParser.dot, inputToQsParser.dash])
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

const expr = parsely.sepBy1(choices)(inputToQsParser.and);
const emptyOrExpr = parsely.optional(expr);
const logParser = parsely.parseStr([emptyOrExpr, parsely.endOfString]);

export default fp.memoize(
  fp.flow(
    tokenizer,
    logParser,
    x => x.result
  )
);
