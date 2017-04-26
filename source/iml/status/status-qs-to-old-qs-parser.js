// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@mfl/fp';
import { parser } from '@mfl/qs-parsers/source/qs-to-old-qs-parser.js';
import { qsToInputTokens } from '@mfl/qs-parsers/source/tokens.js';
import * as parsely from '@mfl/parsely';

const tokenizer = parsely.getLexer(qsToInputTokens);
export default fp.memoize(
  fp.flow(
    tokenizer,
    parser,
    ({ result }) => (result instanceof Error ? '' : result)
  )
);
