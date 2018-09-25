// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import { parser } from "@iml/qs-parsers/source/qs-to-old-qs-parser.js";
import { qsToInputTokens } from "@iml/qs-parsers/source/tokens.js";
import * as parsely from "@iml/parsely";

const tokenizer = parsely.getLexer(qsToInputTokens);
export default fp.memoize(
  fp.flow(
    tokenizer,
    parser,
    ({ result }) => (result instanceof Error ? "" : result)
  )
);
