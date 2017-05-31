// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import d3Module from '../../../d3/d3-module';

import {axisDirective} from './axis-directive';

export default angular.module('axis', [d3Module])
  .directive('axis', axisDirective)
  .name;
