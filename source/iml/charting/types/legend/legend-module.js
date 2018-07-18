// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import { getLegendFactory } from './get-legend';
import { legendDirective } from './legend-directive';

export default angular
  .module('legend', [])
  .directive('legend', legendDirective)
  .factory('getLegend', getLegendFactory).name;
