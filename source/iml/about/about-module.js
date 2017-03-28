// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import helpModule from '../help-module';
import AboutCtrl from './about-controller';

export default angular
  .module('about', [helpModule])
  .controller('AboutCtrl', AboutCtrl).name;
