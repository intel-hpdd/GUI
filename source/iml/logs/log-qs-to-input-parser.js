// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import * as qsToInputParser from "@iml/qs-parsers/source/qs-to-input-parser.js";
import * as parsely from "@iml/parsely";

import { qsToInputTokens } from "@iml/qs-parsers/source/tokens.js";

const tokenizer = parsely.getLexer(qsToInputTokens);

const leftHands = parsely.choice([
  parsely.matchValueTo("datetime", "date"),
  parsely.matchValueTo("tag", "service"),
  parsely.matchValueTo("message_class", "type"),
  parsely.matchValueTo("fqdn", "host"),
  qsToInputParser.value
]);

const valueOrNumberOrDotOrDash = parsely.choice([
  qsToInputParser.dot,
  qsToInputParser.dash,
  qsToInputParser.value,
  qsToInputParser.number
]);

const rightHands = parsely.choice(
  ["NORMAL", "LUSTRE", "LUSTRE_ERROR", "COPYTOOL", "COPYTOOL_ERROR"]
    .map(severity =>
      fp.flow(
        parsely.matchValue(severity),
        parsely.onSuccess(x => x.toLowerCase())
      )
    )
    .concat(parsely.many1(valueOrNumberOrDotOrDash))
);

const assign = qsToInputParser.assign(leftHands, rightHands);
const like = qsToInputParser.like(leftHands, rightHands);
const starts = qsToInputParser.starts(leftHands, rightHands);
const ends = qsToInputParser.ends(leftHands, rightHands);
const inList = qsToInputParser.inList(leftHands, rightHands);
const date = qsToInputParser.dateParser(leftHands);
const orderBy = qsToInputParser.orderByParser(leftHands);
const choices = parsely.choice([like, starts, ends, inList, date, assign, orderBy]);
const expr = parsely.sepBy1(choices)(qsToInputParser.and);
const emptyOrExpr = parsely.optional(expr);
const logParser = parsely.parseStr([emptyOrExpr, parsely.endOfString]);

export default fp.memoize(
  fp.flow(
    tokenizer,
    logParser,
    x => x.result
  )
);
