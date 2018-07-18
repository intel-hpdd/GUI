// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';
import * as qsToInputParser from '@iml/qs-parsers/source/qs-to-input-parser.js';
import { qsToInputTokens } from '@iml/qs-parsers/source/tokens.js';
import * as parsely from '@iml/parsely';

const tokenizer = parsely.getLexer(qsToInputTokens);

const leftHands = parsely.choice([
  parsely.matchValue('severity'),
  parsely.matchValueTo('record_type', 'type'),
  qsToInputParser.value
]);

const rightHands = parsely.choice(
  ['INFO', 'DEBUG', 'CRITICAL', 'WARNING', 'ERROR']
    .map(severity =>
      fp.flow(
        parsely.matchValue(severity),
        parsely.onSuccess(x => x.toLowerCase())
      )
    )
    .concat([parsely.matchValueTo('none', 'false'), qsToInputParser.value, qsToInputParser.number])
);

const assign = qsToInputParser.assign(leftHands, rightHands);
const like = qsToInputParser.like(leftHands, rightHands);
const ends = qsToInputParser.ends(leftHands, rightHands);
const inList = qsToInputParser.inList(leftHands, rightHands);
const date = qsToInputParser.dateParser(qsToInputParser.value);
const orderBy = qsToInputParser.orderByParser(qsToInputParser.value);
const choices = parsely.choice([like, ends, inList, date, assign, orderBy]);
const expr = parsely.sepBy1(choices)(qsToInputParser.and);
const emptyOrExpr = parsely.optional(expr);
const statusParser = parsely.parseStr([emptyOrExpr, parsely.endOfString]);

export default fp.memoize(
  fp.flow(
    tokenizer,
    statusParser,
    x => x.result
  )
);
