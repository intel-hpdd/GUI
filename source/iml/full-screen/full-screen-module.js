// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import {fullScreen, fullScreenBtn} from './full-screen-directive';

export default angular.module('fullScreen', [])
  .directive('fullScreen', fullScreen)
  .directive('fullScreenBtn', fullScreenBtn)
  .name;
