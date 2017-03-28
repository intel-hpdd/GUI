// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';

import { getLineFactory } from './get-line';
import { lineDirective } from './line-directive';

export default angular
  .module('line', [])
  .directive('line', lineDirective)
  .factory('getLine', getLineFactory).name;
