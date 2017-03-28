// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';

import routeToDirective from './route-to';
import environmentModule from '../environment-module';

export default angular
  .module('route-to', [environmentModule])
  .directive('routeTo', routeToDirective).name;
