// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import asStream from './as-stream';

export default angular.module('asStream', []).directive('asStream', asStream).name;
