// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import qsFromLocationModule from '../qs-from-location/qs-from-location-module';
import highlandModule from '../highland/highland-module';
import qsStreamFactory from './qs-stream.js';

import type { HookMatchCriteriaT } from 'angular-ui-router';

import type { HighlandStreamT } from 'highland';

export type qsStreamT = (params: Object, match?: HookMatchCriteriaT) => HighlandStreamT<{ qs: string }>;

export default angular.module('qsStream', [qsFromLocationModule, highlandModule]).factory('qsStream', qsStreamFactory)
  .name;
