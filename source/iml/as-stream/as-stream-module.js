// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import highlandModule from '../highland/highland-module';
import asStream from './as-stream';

export default angular
  .module('asStream', [highlandModule])
  .directive('asStream', asStream).name;
