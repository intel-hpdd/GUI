// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';
import {parser} from 'intel-qs-parsers/qs-to-old-qs-parser.js';
import {qsToInputTokens} from 'intel-qs-parsers/tokens.js';
import * as parsely from 'intel-parsely';

const tokenizer = parsely.getLexer(qsToInputTokens);
export default fp.memoize(
  fp.flow(
    tokenizer,
    parser,
    ({result}) => result instanceof Error ? '' : result
  )
);
