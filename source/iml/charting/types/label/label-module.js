// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';


import {labelDirective} from './label-directive';
import {getLabelFactory} from './get-label';

export default angular.module('label', [])
  .directive('label', labelDirective)
  .factory('getLabel', getLabelFactory)
  .name;
