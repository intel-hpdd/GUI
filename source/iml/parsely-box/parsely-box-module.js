// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import tooltipModule from '../tooltip/tooltip-module.js';
import completionistModule from '../completionist/completionist-module.js';
import {parselyBox, parseQuery} from './parsely-box.js';

export default angular
.module('parselyBox', [
  completionistModule,
  tooltipModule
])
.directive('parselyBox', parselyBox)
.directive('parseQuery', parseQuery)
.name;
