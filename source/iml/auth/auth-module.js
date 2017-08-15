// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import modelFactoryModule from '../model-factory/model-factory-module';
import { GROUPS, restrictTo, restrict } from './authorization.js';

import type { Exact } from '../../flow-workarounds.js';

export type credentialsT = Exact<{
  username: string,
  password: string
}>;

export default angular
  .module('auth', [modelFactoryModule])
  .constant('GROUPS', GROUPS)
  .directive('restrictTo', restrictTo)
  .directive('restrict', restrict).name;
