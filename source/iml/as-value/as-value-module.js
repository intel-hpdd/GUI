// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import extendScopeModule from '../extend-scope-module';
import asValue from './as-value';

export default angular.module('asValue', [extendScopeModule]).directive('asValue', asValue).name;
