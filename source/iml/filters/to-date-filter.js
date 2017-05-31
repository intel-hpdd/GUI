// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import {memoize} from 'intel-fp';
import createDate from '../create-date.js';

export default memoize(createDate);
