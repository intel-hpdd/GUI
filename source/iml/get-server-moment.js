// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import moment from 'moment';
import {SERVER_TIME_DIFF} from './environment.js';

/*eslint no-unused-vars: 0 */
// $FlowFixMe: twix does monkey-patching of moment. it does not export anything useful.
import twix from 'twix';

export default function getServerMoment () {
  return moment
    .apply(moment, arguments)
    .add(SERVER_TIME_DIFF);
}
