// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import completer from "../completionist/completer.js";

import { tokenizer, choices } from "./log-input-to-qs-parser.js";

export default completer(tokenizer, choices);
