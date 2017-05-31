// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import d3Module from '../../../d3/d3-module';
import debounceModule from '../../../debounce/debounce-module';

import {charterDirective} from './chart-directive';

export default angular.module('chart', [
  d3Module, debounceModule
])
  .directive('charter', charterDirective)
  .name;
