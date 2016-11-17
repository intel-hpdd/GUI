// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import modelFactoryModule from '../model-factory/model-factory-module';
import environmentModule from '../environment-module';
import SessionModel from './session-model';
import UserModel from './user-model';
import {authorization, GROUPS, restrictTo, restrict} from './authorization';

import type {
  sessionT
} from '../api-types.js';

import type {
  Exact
} from '../../flow-workarounds.js';

export type credentialsT = Exact<{
  username:string,
  password:string
}>;

export type sessionActionT = Exact<{type:'SET_SESSION', payload:sessionT}>;

export type sessionActionsT =
  | sessionActionT
  | Exact<{type:string, payload:any}>;

export default angular.module('auth', [modelFactoryModule, environmentModule])
  .value('EULA_STATES', {
    EULA: 'eula',
    PASS: 'pass',
    DENIED: 'denied'
  })
  .factory('SessionModel', SessionModel)
  .factory('UserModel', UserModel)
  .value('authorization', authorization)
  .constant('GROUPS', GROUPS)
  .directive('restrictTo', restrictTo)
  .directive('restrict', restrict)
  .name;
