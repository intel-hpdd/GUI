// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import extractApiFilter from './extract-api-filter.js';

export default angular.module('extractApiFilter', [])
  .filter('extractApi', extractApiFilter)
  .name;
