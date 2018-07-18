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

const severity = parsely.matchValue('severity');

// severity parser
const severities = parsely.choice(
  ['info', 'debug', 'critical', 'warning', 'error'].map(severity =>
    fp.flow(
      parsely.matchValue(severity),
      parsely.onSuccess(x => x.toUpperCase())
    )
  )
);

const assignSeverity = inputToQsParser.assign(severity, severities);
const inListSeverity = inputToQsParser.inList(severity, severities);
const severityParser = parsely.choice([inListSeverity, assignSeverity]);

// type parser
const type = parsely.matchValueTo('type', 'record_type');
const assign: tokensToResult = inputToQsParser.assign(type, inputToQsParser.value);
const like: tokensToResult = inputToQsParser.like(type, inputToQsParser.value);
const ends: tokensToResult = inputToQsParser.ends(type, inputToQsParser.value);
const inList: tokensToResult = inputToQsParser.inList(type, inputToQsParser.value);
const typeParser = parsely.choice([inList, like, ends, assign]);

const begin = parsely.matchValue('begin');
const end = parsely.matchValue('end');
const beginOrEnd = parsely.choice([begin, end]);

const rightHand = fp.flow(
  parsely.parseStr([beginOrEnd, inputToQsParser.ascOrDesc]),
  parsely.onSuccess(x =>
    x
      .split('-')
      .reverse()
      .join('-')
  )
);

const orderByParser = parsely.parseStr([inputToQsParser.orderBy, rightHand]);

// active parser
const active = parsely.matchValue('active');
const t = parsely.matchValue('true');
const f = parsely.matchValueTo('false', 'none');
const activeParser = inputToQsParser.assign(active, parsely.choice([t, f]));

export const choices = parsely.choice([
  severityParser,
  typeParser,
  activeParser,
  inputToQsParser.offsetParser,
  inputToQsParser.limitParser,
  orderByParser,
  inputToQsParser.dateParser(beginOrEnd)
]);
const expr = parsely.sepBy1(choices)(inputToQsParser.and);
const emptyOrExpr = parsely.optional(expr);
const statusParser = parsely.parseStr([emptyOrExpr, parsely.endOfString]);

export default fp.memoize(
  fp.flow(
    tokenizer,
    statusParser,
    x => x.result
  )
);
