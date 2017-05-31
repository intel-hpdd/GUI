// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';

import * as ENV from './environment.js';

const environmentModule = angular.module('environment', []);

environmentModule.value('ENV', ENV);

Object.keys(ENV)
  .forEach(key => environmentModule
    .value(key, ENV[key])
  );

export default environmentModule.name;
