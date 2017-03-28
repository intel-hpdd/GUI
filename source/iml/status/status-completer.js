// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import completer from '../completionist/completer.js';

import { tokenizer, choices } from './status-input-to-qs-parser.js';

export default completer(tokenizer, choices);
